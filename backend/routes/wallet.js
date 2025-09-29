import express from 'express';
import { body } from 'express-validator';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { authenticate, requireKYC } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/wallet/balance
// @desc    Get user wallet balance
// @access  Private
router.get('/balance', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        balance: user.walletBalance,
        currency: 'INR'
      }
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching balance'
    });
  }
});

// @route   POST /api/wallet/add
// @desc    Add money to wallet (simulated payment)
// @access  Private
router.post('/add', authenticate, [
  body('amount')
    .isFloat({ min: 1, max: 1000000 })
    .withMessage('Amount must be between ₹1 and ₹10,00,000'),
  
  body('paymentMethod')
    .isIn(['upi', 'card', 'netbanking', 'qr'])
    .withMessage('Invalid payment method'),
  
  handleValidationErrors
], async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const userId = req.user._id;

    // Start a session for transaction
    const session = await User.startSession();
    session.startTransaction();

    try {
      // Update user balance
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { walletBalance: amount } },
        { new: true, session }
      );

      // Create transaction record
      const transaction = new Transaction({
        senderId: userId,
        amount,
        type: 'add_money',
        status: 'completed',
        description: `Money added via ${paymentMethod}`,
        paymentMethod,
        processedAt: new Date()
      });

      await transaction.save({ session });

      // Commit transaction
      await session.commitTransaction();

      res.json({
        success: true,
        message: 'Money added successfully',
        data: {
          newBalance: user.walletBalance,
          transaction: transaction
        }
      });
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Add money error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding money'
    });
  }
});

// @route   POST /api/wallet/transfer
// @desc    Transfer money to another user
// @access  Private
router.post('/transfer', authenticate, requireKYC, [
  body('recipient')
    .notEmpty()
    .withMessage('Recipient email or phone is required'),
  
  body('amount')
    .isFloat({ min: 1, max: 1000000 })
    .withMessage('Amount must be between ₹1 and ₹10,00,000'),
  
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  
  handleValidationErrors
], async (req, res) => {
  try {
    const { recipient, amount, description = 'Money transfer' } = req.body;
    const senderId = req.user._id;

    // Check if user is trying to transfer to themselves
    const sender = await User.findById(senderId);
    if (sender.email === recipient || sender.phone === recipient) {
      return res.status(400).json({
        success: false,
        message: 'Cannot transfer money to yourself'
      });
    }

    // Find recipient
    const receiver = await User.findByEmailOrPhone(recipient);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Check if receiver account is active
    if (!receiver.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Recipient account is not active'
      });
    }

    // Check sender balance
    if (sender.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Start a session for transaction
    const session = await User.startSession();
    session.startTransaction();

    try {
      // Update sender balance
      const updatedSender = await User.findByIdAndUpdate(
        senderId,
        { $inc: { walletBalance: -amount } },
        { new: true, session }
      );

      // Update receiver balance
      const updatedReceiver = await User.findByIdAndUpdate(
        receiver._id,
        { $inc: { walletBalance: amount } },
        { new: true, session }
      );

      // Create transaction record
      const transaction = new Transaction({
        senderId,
        receiverId: receiver._id,
        amount,
        type: 'transfer',
        status: 'completed',
        description,
        processedAt: new Date()
      });

      await transaction.save({ session });

      // Commit transaction
      await session.commitTransaction();

      res.json({
        success: true,
        message: 'Money transferred successfully',
        data: {
          newBalance: updatedSender.walletBalance,
          recipient: {
            name: receiver.name,
            email: receiver.email,
            phone: receiver.phone
          },
          transaction: transaction
        }
      });
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Transfer money error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while transferring money'
    });
  }
});

// @route   POST /api/wallet/withdraw
// @desc    Withdraw money to bank account
// @access  Private
router.post('/withdraw', authenticate, requireKYC, [
  body('amount')
    .isFloat({ min: 1, max: 1000000 })
    .withMessage('Amount must be between ₹1 and ₹10,00,000'),
  
  body('bankDetails.accountNumber')
    .notEmpty()
    .withMessage('Account number is required')
    .matches(/^\d{9,18}$/)
    .withMessage('Account number must be between 9 and 18 digits'),
  
  body('bankDetails.ifscCode')
    .notEmpty()
    .withMessage('IFSC code is required')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .withMessage('Invalid IFSC code format'),
  
  body('bankDetails.bankName')
    .notEmpty()
    .withMessage('Bank name is required'),
  
  body('bankDetails.accountHolder')
    .notEmpty()
    .withMessage('Account holder name is required'),
  
  handleValidationErrors
], async (req, res) => {
  try {
    const { amount, bankDetails } = req.body;
    const userId = req.user._id;

    // Check user balance
    const user = await User.findById(userId);
    if (user.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Start a session for transaction
    const session = await User.startSession();
    session.startTransaction();

    try {
      // Update user balance
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { walletBalance: -amount } },
        { new: true, session }
      );

      // Create transaction record
      const transaction = new Transaction({
        senderId: userId,
        amount,
        type: 'withdraw',
        status: 'pending', // Withdrawals are processed asynchronously
        description: `Withdrawal to ${bankDetails.bankName} - ${bankDetails.accountNumber}`,
        bankDetails
      });

      await transaction.save({ session });

      // Commit transaction
      await session.commitTransaction();

      // Simulate bank processing (in real app, this would be handled by a queue)
      setTimeout(async () => {
        try {
          await Transaction.findByIdAndUpdate(transaction._id, {
            status: 'completed',
            processedAt: new Date()
          });
          console.log(`Withdrawal processed: ${transaction._id}`);
        } catch (error) {
          console.error('Error processing withdrawal:', error);
        }
      }, 5000); // Simulate 5 second processing time

      res.json({
        success: true,
        message: 'Withdrawal request submitted successfully',
        data: {
          newBalance: updatedUser.walletBalance,
          transaction: transaction,
          estimatedProcessingTime: '5-10 minutes'
        }
      });
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Withdraw money error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing withdrawal'
    });
  }
});

// @route   GET /api/wallet/recipients
// @desc    Search for recipients by email or phone
// @access  Private
router.get('/recipients', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 3 characters'
      });
    }

    const recipients = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // Exclude current user
        { isActive: true },
        {
          $or: [
            { email: { $regex: q, $options: 'i' } },
            { phone: { $regex: q, $options: 'i' } },
            { name: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
    .select('name email phone')
    .limit(10);

    res.json({
      success: true,
      data: {
        recipients
      }
    });
  } catch (error) {
    console.error('Search recipients error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching recipients'
    });
  }
});

export default router;
