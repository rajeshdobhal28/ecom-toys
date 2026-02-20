import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default {
  port: process.env.PORT || 3001,
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL,
};

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not defined in environment variables!');
  console.log('Current directory:', __dirname);
  console.log('Expected .env path:', path.resolve(__dirname, '../../.env'));
} else {
  console.log(
    '✅ DATABASE_URL loaded:',
    process.env.DATABASE_URL.split('@')[1] || 'Hidden'
  ); // Log part to verify
}
