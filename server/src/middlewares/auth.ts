import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export interface AuthRequest extends Request {
  user?: any;
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

    const decoded = authService.verifyJwt(token);
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
