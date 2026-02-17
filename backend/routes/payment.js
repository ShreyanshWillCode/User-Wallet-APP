import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * @route   POST /api/payment/webhook
 * @desc    Razorpay webhook handler for payment events
 * @access  Public (but verified with signature)
 * 
 * CRITICAL: Raw body parser is applied in server.js BEFORE express.json()
 * Do NOT add express.raw() here or it will be applied twice
 */
router.post('/webhook', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (!webhookSecret) {
      console.error('❌ RAZORPAY_WEBHOOK_SECRET not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // Get raw body (already parsed by express.raw() in server.js)
    const body = req.body.toString();
    
    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    // SECURITY FIX: Use timing-safe comparison to prevent timing attacks
    const signatureBuffer = Buffer.from(signature || '', 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    
    if (signatureBuffer.length !== expectedBuffer.length || 
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      console.error('❌ Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Parse the webhook payload
    const payload = JSON.parse(body);
    const event = payload.event;
    const paymentData = payload.payload.payment.entity;

    console.log(`✅ Webhook received: ${event}`);
    console.log('Payment data:', paymentData);

    // Handle different payment events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(paymentData);
        break;

      case 'payment.failed':
        await handlePaymentFailed(paymentData);
        break;

      case 'payment.authorized':
        console.log('💳 Payment authorized:', paymentData.id);
        break;

      default:
        console.log(`ℹ️ Unhandled event: ${event}`);
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Handle successful payment capture
 * PRODUCTION FIXES:
 * - Idempotency check to prevent double credit
 * - Atomic transaction using MongoDB session
 * - Uses User.walletBalance instead of separate Wallet model
 */
async function handlePaymentCaptured(paymentData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id, amount, notes } = paymentData;
    const userId = notes?.userId;

    if (!userId) {
      console.error('❌ No userId in payment notes');
      await session.abortTransaction();
      return;
    }

    // IDEMPOTENCY CHECK: Prevent duplicate processing
    const existingTxn = await Transaction.findOne({
      razorpayPaymentId: id,
      status: 'completed'
    }).session(session);

    if (existingTxn) {
      console.log('⚠️ Payment already processed:', id);
      await session.abortTransaction();
      return;
    }

    // Convert amount from paise to rupees
    const amountInRupees = amount / 100;

    // Update user wallet balance (with session for atomicity)
    const user = await User.findById(userId).session(session);
    if (!user) {
      console.error('❌ User not found:', userId);
      await session.abortTransaction();
      return;
    }

    user.walletBalance += amountInRupees;
    await user.save({ session });

    // Create transaction record (with session for atomicity)
    // Use actual payment method from Razorpay (upi/card/netbanking)
    const paymentMethod = paymentData.method || 'card'; // Default to card if not provided
    
    await Transaction.create([{
      senderId: userId,
      amount: amountInRupees,
      type: 'add_money',
      status: 'completed',
      description: `Money added via Razorpay (${id})`,
      paymentMethod: paymentMethod, // Actual method: upi, card, netbanking
      paymentGateway: 'razorpay',   // Payment gateway used
      razorpayPaymentId: id,
      processedAt: new Date()
    }], { session });

    // Commit the transaction
    await session.commitTransaction();
    console.log(`✅ Payment captured: ₹${amountInRupees} added to wallet`);
  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Error handling payment capture:', error);
    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentData) {
  try {
    const { id, notes, error_description } = paymentData;
    const userId = notes?.userId;

    if (!userId) {
      console.error('❌ No userId in payment notes');
      return;
    }

    // Create failed transaction record
    await Transaction.create({
      senderId: userId,
      amount: 0,
      type: 'add_money',
      status: 'failed',
      description: `Payment failed: ${error_description || 'Unknown error'}`,
      paymentMethod: 'razorpay',
      razorpayPaymentId: id
    });

    console.log(`❌ Payment failed: ${id} - ${error_description}`);
  } catch (error) {
    console.error('❌ Error handling payment failure:', error);
  }
}

/**
 * @route   POST /api/payment/create-order
 * @desc    Create Razorpay order for payment
 * @access  Private (requires authentication)
 */
router.post('/create-order', authenticate, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id; // From authenticate middleware

    if (!amount || amount < 10) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid amount. Minimum ₹10 required.' 
      });
    }

    if (amount > 100000) {
      return res.status(400).json({ 
        success: false,
        error: 'Maximum amount is ₹1,00,000' 
      });
    }

    // Create real Razorpay order
    // Receipt must be under 40 characters (Razorpay requirement)
    const shortReceipt = `rcpt_${crypto.randomBytes(6).toString('hex')}`;
    
    const options = {
      amount: Math.round(amount * 100), // Convert to paise and ensure integer
      currency: 'INR',
      receipt: shortReceipt, // Max 40 chars
      notes: {
        userId: userId.toString(),
        purpose: 'wallet_recharge'
      }
    };

    const order = await razorpay.orders.create(options);

    console.log('✅ Razorpay order created:', order.id);

    res.json({ 
      success: true, 
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID // Send key_id to frontend
      }
    });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create payment order. Please try again.' 
    });
  }
});

export default router;
