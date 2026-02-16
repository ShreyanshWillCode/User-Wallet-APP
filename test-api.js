const https = require('https');

const data = JSON.stringify({
  name: 'Test User',
  email: 'testuser@example.com',
  phone: '9876543210',
  password: 'password123'
});

const options = {
  hostname: 'ewallet-eight.vercel.app',
  port: 443,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
