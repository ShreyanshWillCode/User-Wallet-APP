# Environment Variables for Vercel Deployment

## Required Environment Variables

Add these environment variables in your Vercel dashboard under Settings > Environment Variables:

### Database Configuration
```
MONGODB_URI=mongodb+srv://E-Wallet:Shrey%40nsh12@cluster0.0nlbf3w.mongodb.net/wallet_app?retryWrites=true&w=majority&appName=Cluster0
MONGODB_TEST_URI=mongodb+srv://E-Wallet:Shrey%40nsh12@cluster0.0nlbf3w.mongodb.net/wallet_app_test?retryWrites=true&w=majority&appName=Cluster0
```

### JWT Configuration
```
JWT_SECRET=S4WrJpC6Zp5aK6iPhjPcXvUH9DSTelRz2/zA73qMQzyZFynlIGNI5hRKqVJSFtsWjpRYG9Zmhkbu4x7xGLGBbA==
JWT_EXPIRE=7d
```

### Server Configuration
```
NODE_ENV=production
PORT=5000
```

### CORS Configuration
```
CLIENT_URL=https://your-app-name.vercel.app
```

### Payment Gateway (Optional - for future Razorpay integration)
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### Rate Limiting
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with its value
5. Make sure to select "Production", "Preview", and "Development" environments
6. Click "Save"

## Security Notes

- Never commit these values to your repository
- Use strong, unique values for JWT_SECRET
- Keep your MongoDB credentials secure
- Rotate secrets regularly in production
