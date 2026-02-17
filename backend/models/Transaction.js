import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type !== 'add_money';
    }
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type === 'transfer';
    }
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
    max: [1000000, 'Amount cannot exceed 1,000,000']
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: ['add_money', 'transfer', 'withdraw', 'refund'],
      message: 'Transaction type must be one of: add_money, transfer, withdraw, refund'
    }
  },
  status: {
    type: String,
    required: [true, 'Transaction status is required'],
    enum: {
      values: ['pending', 'completed', 'failed', 'cancelled'],
      message: 'Status must be one of: pending, completed, failed, cancelled'
    },
    default: 'pending'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  reference: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'qr', 'wallet'],
    required: function() {
      return this.type === 'add_money';
    }
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'manual'],
    default: 'manual'
  },
  razorpayPaymentId: {
    type: String,
    sparse: true,
    index: true
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolder: String
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  processedAt: {
    type: Date,
    default: null
  },
  failureReason: {
    type: String,
    maxlength: [500, 'Failure reason cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better query performance
transactionSchema.index({ senderId: 1, createdAt: -1 });
transactionSchema.index({ receiverId: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ createdAt: -1 });
// Reference index is already defined in schema with unique: true, sparse: true

// Virtual for transaction direction
transactionSchema.virtual('direction').get(function() {
  if (this.type === 'add_money' || this.type === 'refund') {
    return 'credit';
  }
  return 'debit';
});

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(this.amount);
});

// Pre-save middleware to generate reference
transactionSchema.pre('save', async function(next) {
  if (!this.reference && this.isNew) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.reference = `TXN_${timestamp}_${random}`.toUpperCase();
  }
  next();
});

// Pre-save middleware to update processedAt
transactionSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.processedAt) {
    this.processedAt = new Date();
  }
  next();
});

// Static method to get user transactions
transactionSchema.statics.getUserTransactions = function(userId, options = {}) {
  const {
    type,
    status,
    limit = 20,
    skip = 0,
    startDate,
    endDate
  } = options;

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

  return this.find(query)
    .populate('senderId', 'name email phone')
    .populate('receiverId', 'name email phone')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get transaction statistics
transactionSchema.statics.getUserStats = function(userId, period = '30d') {
  const now = new Date();
  let startDate;

  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return this.aggregate([
    {
      $match: {
        $or: [
          { senderId: mongoose.Types.ObjectId(userId) },
          { receiverId: mongoose.Types.ObjectId(userId) }
        ],
        createdAt: { $gte: startDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalSent: {
          $sum: {
            $cond: [
              { $eq: ['$senderId', mongoose.Types.ObjectId(userId)] },
              '$amount',
              0
            ]
          }
        },
        totalReceived: {
          $sum: {
            $cond: [
              { $eq: ['$receiverId', mongoose.Types.ObjectId(userId)] },
              '$amount',
              0
            ]
          }
        }
      }
    }
  ]);
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
