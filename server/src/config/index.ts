import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default {
  port: process.env.NODE_PORT || 3001,
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL,
  paymentApiKey: process.env.PAYMENT_API_KEY || '',
  paymentApiSecret: process.env.PAYMENT_API_SECRET || '',
  companyName: process.env.COMPANY_NAME || '',
};

// Fail loudly at startup if payment credentials are missing. Without these the
// HMAC signature check would silently use an empty secret and reject every
// payment, so surface it here rather than per-request.
const missingPaymentVars = ['PAYMENT_API_KEY', 'PAYMENT_API_SECRET'].filter(
  (name) => !process.env[name]
);
if (missingPaymentVars.length > 0) {
  console.error(
    `❌ Missing payment env vars: ${missingPaymentVars.join(', ')} — payment endpoints will not work.`
  );
}

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
