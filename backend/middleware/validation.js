import { body, validationResult } from 'express-validator';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User registration validation
export const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('phone')
    .matches(/^[\+]?[0-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  handleValidationErrors
];

// User login validation
export const validateUserLogin = [
  body('identifier')
    .notEmpty()
    .withMessage('Email or phone number is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Wallet operations validation
export const validateAddMoney = [
  body('amount')
    .isFloat({ min: 1, max: 1000000 })
    .withMessage('Amount must be between ₹1 and ₹10,00,000'),
  
  body('paymentMethod')
    .isIn(['upi', 'card', 'netbanking', 'qr'])
    .withMessage('Invalid payment method'),
  
  handleValidationErrors
];

export const validateTransfer = [
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
];

export const validateWithdraw = [
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
];

// Transaction query validation
export const validateTransactionQuery = [
  body('type')
    .optional()
    .isIn(['add_money', 'transfer', 'withdraw', 'refund'])
    .withMessage('Invalid transaction type'),
  
  body('status')
    .optional()
    .isIn(['pending', 'completed', 'failed', 'cancelled'])
    .withMessage('Invalid transaction status'),
  
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  body('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip must be a non-negative integer'),
  
  handleValidationErrors
];
