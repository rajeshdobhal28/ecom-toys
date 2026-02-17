import { Request, Response } from 'express';
import * as authService from '../services/authService';
import config from '../config';
import logger from '../utils/logger';

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(400).send({ status: 'error', message: 'Token is required' });
            return;
        }

        const payload = await authService.verifyGoogleToken(token);
        if (!payload) {
            res.status(401).send({ status: 'error', message: 'Invalid Google token' });
            return;
        }

        const { email, name, picture } = payload;

        console.log("------>", payload);

        // Upsert user in database
        const user = await authService.findOrCreateUser({ email, name, picture });

        // Use database user data for token (optional, or just email)
        const jwtToken = authService.generateToken({
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture
        });

        res.cookie('secureToken', jwtToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        logger.info(`User logged in: ${email}`);
        res.send({ status: 'success', data: { email, name, picture, token } });
    } catch (err: any) {
        logger.error('Google login error', err.message);
        res.status(500).send({ status: 'error', message: "Internal Server Error" });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.secureToken;
        if (!token) {
            res.status(401).send({ status: 'error', message: 'Not authenticated' });
            return;
        }

        const decoded = authService.verifyJwt(token);
        if (!decoded) {
            res.status(401).send({ status: 'error', message: 'Invalid or expired token' });
            return;
        }

        res.send({ status: 'success', data: decoded });
    } catch (err: any) {
        logger.error('Get Me error', err.message);
        res.status(500).send({ status: 'error', message: "Internal Server Error" });
    }
};

export const logout = (req: Request, res: Response): void => {
    res.clearCookie('secureToken', {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'strict'
    });
    res.send({ status: 'success', message: 'Logged out' });
};
