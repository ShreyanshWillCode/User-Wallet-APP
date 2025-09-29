  # Simple User Wallet Web App

A full-stack web application for digital wallet operations including adding money, transferring funds, viewing transaction history, and withdrawing to bank accounts.

## 🚀 Features

### Backend (Node.js + Express + MongoDB)
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Wallet Operations**: Add money, transfer between users, withdraw to bank
- **Transaction Management**: Complete transaction history with filtering and pagination
- **Security**: Input validation, rate limiting, CORS protection
- **Database**: MongoDB with Mongoose ODM

### Frontend (React + TailwindCSS)
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **State Management**: React Query for server state, Context API for auth
- **Modern UI**: Clean, accessible interface with loading states
- **Real-time Updates**: Automatic data refetching and cache invalidation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd simple-user-wallet
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/wallet_app
MONGODB_TEST_URI=mongodb://localhost:27017/wallet_app_test

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the necessary collections and indexes.

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Wallet Operations
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/add` - Add money to wallet
- `POST /api/wallet/transfer` - Transfer money to another user
- `POST /api/wallet/withdraw` - Withdraw money to bank account
- `GET /api/wallet/recipients` - Search for recipients

### Transactions
- `GET /api/transactions` - Get transaction history
- `GET /api/transactions/:id` - Get specific transaction
- `GET /api/transactions/stats/summary` - Get transaction statistics
- `GET /api/transactions/stats/monthly` - Get monthly statistics

## 🎨 Frontend Pages

1. **Login/Signup** - User authentication
2. **Dashboard** - Overview of wallet balance and recent transactions
3. **Add Money** - Add funds to wallet (simulated payment)
4. **Send Money** - Transfer money to other users
5. **Withdraw** - Withdraw money to bank account
6. **Transaction History** - View and filter all transactions
7. **Profile** - Manage user profile and settings

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
npm start    # Production start
npm test     # Run tests
```

### Frontend Development
```bash
cd frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📱 Demo Credentials

For testing purposes, you can use these demo credentials:
- **Email**: demo@example.com
- **Phone**: +1234567890
- **Password**: password123

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS protection
- Helmet.js for security headers
- Environment variable protection

## 🎯 Key Features

### Simulation Mode
- No real money transactions
- Simulated payment processing
- Instant balance updates
- Mock bank processing for withdrawals

### User Experience
- Responsive design for all devices
- Real-time balance updates
- Transaction notifications
- Loading states and error handling
- Intuitive navigation

### Data Management
- Efficient database queries with indexes
- Pagination for large datasets
- Transaction history filtering
- Real-time statistics

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure API endpoints for production

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  walletBalance: Number,
  kycStatus: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```javascript
{
  senderId: ObjectId,
  receiverId: ObjectId,
  amount: Number,
  type: String,
  status: String,
  description: String,
  reference: String,
  paymentMethod: String,
  bankDetails: Object,
  processedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Note**: This is a demo application for educational purposes. Do not use for real financial transactions without proper security audits and compliance measures.