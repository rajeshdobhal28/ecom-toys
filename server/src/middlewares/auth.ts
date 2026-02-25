import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  picture: string;
  isAdmin?: boolean;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.secureToken;
    if (!token) {
      res.status(401).send({ status: 'error', message: 'Not authenticated' });
      return;
    }

    const decoded = authService.verifyJwt(token) as UserPayload | null;
    if (!decoded) {
      res
        .status(401)
        .send({ status: 'error', message: 'Invalid or expired token' });
      return;
    }

    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).send({ status: 'error', message: 'Authentication failed' });
  }
};

export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !req.user.isAdmin) {
    res.status(403).send({ status: 'error', message: 'Forbidden: Admin access required' });
    return;
  }
  next();
};

export const optionalAuthenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.secureToken;
    if (token) {
      const decoded = authService.verifyJwt(token) as UserPayload | null;
      if (decoded) {
        req.user = decoded;
      }
    }
    next();
  } catch (err: any) {
    // If token is invalid, just proceed as unauthenticated
    next();
  }
};
