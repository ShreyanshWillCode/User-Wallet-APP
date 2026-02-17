import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.js';
import walletRoutes from './routes/wallet.js';
import transactionRoutes from './routes/transactions.js';
import paymentRoutes from './routes/payment.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

dotenv.config();

const app = express();

/* ===============================
   DATABASE CONNECTION (SERVERLESS SAFE)
================================= */

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) return cachedConnection;

  try {
    const mongoURI =
      process.env.NODE_ENV === 'test'
        ? process.env.MONGODB_TEST_URI
        : process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });

    cachedConnection = conn;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

/* ===============================
   SECURITY MIDDLEWARE
================================= */

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
});
app.use(limiter);

/* ===============================
   CORS CONFIG
================================= */

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      /^https:\/\/.*\.vercel\.app$/,
    ],
    credentials: true,
  })
);

/* ===============================
   BODY PARSER & LOGGER
================================= */

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* ===============================
   HEALTH CHECK
================================= */

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
  });
});

/* ===============================
   DATABASE CONNECTION MIDDLEWARE
================================= */

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

/* ===============================
   ROUTES
================================= */

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/payment', paymentRoutes);

/* ===============================
   ERROR HANDLING
================================= */

app.use(notFound);
app.use(errorHandler);

/* ===============================
   LOCAL SERVER (ONLY FOR DEV)
================================= */

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

/* ===============================
   EXPORT FOR VERCEL
================================= */

export default app;
