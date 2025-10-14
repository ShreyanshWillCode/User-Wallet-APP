#!/usr/bin/env node

/**
 * Setup Environment Variables Script
 * 
 * This script copies backend/env.example to backend/.env
 * to set up secure environment variables for local development.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = path.join(__dirname, 'backend', 'env.example');
const targetFile = path.join(__dirname, 'backend', '.env');

try {
  // Check if source file exists
  if (!fs.existsSync(sourceFile)) {
    console.error('❌ Error: backend/env.example file not found');
    process.exit(1);
  }

  // Check if target file already exists
  if (fs.existsSync(targetFile)) {
    console.log('⚠️  Warning: backend/.env already exists');
    console.log('   The existing .env file will be backed up to .env.backup');
    
    // Backup existing .env file
    const backupFile = targetFile + '.backup';
    fs.copyFileSync(targetFile, backupFile);
    console.log(`   Backup created: ${backupFile}`);
  }

  // Copy env.example to .env
  fs.copyFileSync(sourceFile, targetFile);
  
  console.log('✅ Successfully created backend/.env from backend/env.example');
  console.log('🔒 Your secure environment variables are now ready for local development');
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Review backend/.env to ensure all values are correct');
  console.log('   2. Never commit the .env file to version control');
  console.log('   3. For Vercel deployment, use these values in environment variables');
  console.log('');
  console.log('🚀 You can now run: npm run backend:dev');

} catch (error) {
  console.error('❌ Error setting up environment variables:', error.message);
  process.exit(1);
}
