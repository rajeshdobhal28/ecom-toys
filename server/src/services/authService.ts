import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import config from '../config';
import * as db from '../db';
import logger from '../utils/logger';

const client = new OAuth2Client(config.googleClientId);

export const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.googleClientId,
  });
  return ticket.getPayload();
};

export const findOrCreateUser = async (googleProfile: any) => {
  const { email, name, picture } = googleProfile;
  try {
    // Check if user exists
    const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (res.rows.length > 0) {
      return res.rows[0];
    }

    // Create new user
    // Note: You need to ensure the 'users' table exists in your DB
    const insertRes = await db.query(
      'INSERT INTO users (email, name, picture) VALUES ($1, $2, $3) RETURNING *',
      [email, name, picture]
    );
    return insertRes.rows[0];
  } catch (err: any) {
    logger.error('Error finding/creating user', err);
    throw err;
  }
};

export const generateToken = (payload: object) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });
};

export const verifyJwt = (token: string) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};
