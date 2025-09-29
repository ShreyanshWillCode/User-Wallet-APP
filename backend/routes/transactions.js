import express from 'express';
import Transaction from '../models/Transaction.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get user transactions with filters
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      type,
      status,
      limit = 20,
      skip = 0,
      startDate,
      endDate,
      page = 1
    } = req.query;

    const userId = req.user._id;
    const pageSize = Math.min(parseInt(limit), 100);
    const skipCount = (parseInt(page) - 1) * pageSize;

    // Build query
    const query = {
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    };

    if (type) query.type = type;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Get transactions
    const transactions = await Transaction.find(query)
      .populate('senderId', 'name email phone')
      .populate('receiverId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(skipCount);

    // Get total count for pagination
    const totalCount = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    // Transform transactions to include direction
    const transformedTransactions = transactions.map(transaction => {
      const transactionObj = transaction.toObject();
      transactionObj.direction = transaction.direction;
      transactionObj.formattedAmount = transaction.formattedAmount;
      return transactionObj;
    });

    res.json({
      success: true,
      data: {
        transactions: transformedTransactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transactions'
    });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get specific transaction details
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const transaction = await Transaction.findOne({
      _id: id,
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    })
    .populate('senderId', 'name email phone')
    .populate('receiverId', 'name email phone');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const transactionObj = transaction.toObject();
    transactionObj.direction = transaction.direction;
    transactionObj.formattedAmount = transaction.formattedAmount;

    res.json({
      success: true,
      data: {
        transaction: transactionObj
      }
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transaction'
    });
  }
});

// @route   GET /api/transactions/stats/summary
// @desc    Get transaction statistics summary
// @access  Private
router.get('/stats/summary', authenticate, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const userId = req.user._id;

    const stats = await Transaction.getUserStats(userId, period);

    // Get recent transactions count
    const recentTransactions = await Transaction.countDocuments({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ],
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Get pending transactions count
    const pendingTransactions = await Transaction.countDocuments({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ],
      status: 'pending'
    });

    const result = stats.length > 0 ? stats[0] : {
      totalTransactions: 0,
      totalAmount: 0,
      totalSent: 0,
      totalReceived: 0
    };

    res.json({
      success: true,
      data: {
        period,
        summary: {
          ...result,
          recentTransactions,
          pendingTransactions
        }
      }
    });
  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transaction statistics'
    });
  }
});

// @route   GET /api/transactions/stats/monthly
// @desc    Get monthly transaction statistics
// @access  Private
router.get('/stats/monthly', authenticate, async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const userId = req.user._id;

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const monthlyStats = await Transaction.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ],
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalSent: {
            $sum: {
              $cond: [
                { $eq: ['$senderId', userId] },
                '$amount',
                0
              ]
            }
          },
          totalReceived: {
            $sum: {
              $cond: [
                { $eq: ['$receiverId', userId] },
                '$amount',
                0
              ]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Fill in missing months with zero values
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const completeStats = monthNames.map((month, index) => {
      const monthData = monthlyStats.find(stat => stat._id === index + 1);
      return {
        month: month,
        monthNumber: index + 1,
        totalTransactions: monthData?.totalTransactions || 0,
        totalAmount: monthData?.totalAmount || 0,
        totalSent: monthData?.totalSent || 0,
        totalReceived: monthData?.totalReceived || 0
      };
    });

    res.json({
      success: true,
      data: {
        year: parseInt(year),
        monthlyStats: completeStats
      }
    });
  } catch (error) {
    console.error('Get monthly stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching monthly statistics'
    });
  }
});

export default router;
