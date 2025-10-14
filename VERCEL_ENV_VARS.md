# Environment Variables for Vercel Deployment

## Required Environment Variables

Add these environment variables in your Vercel dashboard under Settings > Environment Variables:

### Database Configuration
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority&appName=<appName>
MONGODB_TEST_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>_test?retryWrites=true&w=majority&appName=<appName>
```

### JWT Configuration
```
JWT_SECRET=<your_secure_base64_encoded_secret_minimum_256_bits>
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

- **CRITICAL**: Never commit these values to your repository
- **CRITICAL**: Use strong, unique values for JWT_SECRET (minimum 256 bits)
- **CRITICAL**: Keep your MongoDB credentials secure and rotate them regularly
- **CRITICAL**: Replace all placeholders with your actual secure credentials
- **CRITICAL**: For local development, copy `backend/env.example` to `backend/.env` with your actual values
- Rotate secrets regularly in production
- Use environment-specific values for different deployment stages
- Monitor for unauthorized access attempts

## Getting Your Secure Values

### For Local Development:
1. Copy `backend/env.example` to `backend/.env`
2. The `.env` file contains your actual secure values
3. Never commit the `.env` file to version control

### For Vercel Deployment:
1. Use the values from your local `backend/.env` file
2. Add them to Vercel environment variables
3. Replace placeholders with your actual secure credentials

### Generate a new JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### MongoDB Atlas Security:
1. Create a dedicated database user with minimal required permissions
2. Use strong passwords (minimum 12 characters with mixed case, numbers, symbols)
3. Enable IP whitelisting for production
4. Enable MongoDB Atlas encryption at rest and in transit
