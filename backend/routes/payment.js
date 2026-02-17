import express from 'express';
import crypto from 'crypto';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

/**
 * @route   POST /api/payment/webhook
 * @desc    Razorpay webhook handler for payment events
 * @access  Public (but verified with signature)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (!webhookSecret) {
      console.error('❌ RAZORPAY_WEBHOOK_SECRET not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // Verify webhook signature
    const body = req.body.toString();
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
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
 */
async function handlePaymentCaptured(paymentData) {
  try {
    const { id, amount, notes } = paymentData;
    const userId = notes?.userId;

    if (!userId) {
      console.error('❌ No userId in payment notes');
      return;
    }

    // Convert amount from paise to rupees
    const amountInRupees = amount / 100;

    // Update wallet balance
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      console.error('❌ Wallet not found for user:', userId);
      return;
    }

    wallet.balance += amountInRupees;
    await wallet.save();

    // Create transaction record
    await Transaction.create({
      user: userId,
      type: 'credit',
      amount: amountInRupees,
      description: `Money added via Razorpay (${id})`,
      paymentMethod: 'razorpay',
      status: 'completed',
      razorpayPaymentId: id
    });

    console.log(`✅ Payment captured: ₹${amountInRupees} added to wallet`);
  } catch (error) {
    console.error('❌ Error handling payment capture:', error);
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
      user: userId,
      type: 'credit',
      amount: 0,
      description: `Payment failed: ${error_description || 'Unknown error'}`,
      paymentMethod: 'razorpay',
      status: 'failed',
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
 * @access  Private
 */
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user?.id; // Assuming you have auth middleware

    if (!amount || amount < 10) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Here you would integrate with Razorpay SDK to create order
    // For now, returning a mock response
    const order = {
      id: `order_${Date.now()}`,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      notes: {
        userId: userId
      }
    };

    res.json({ success: true, order });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

export default router;
