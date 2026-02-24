import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as cartService from '../services/cartService';
import logger from '../utils/logger';

export const getCart = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).send({ status: 'error', message: 'Not authenticated' });
            return;
        }

        const cart = await cartService.getCart(req.user.id);
        res.send({ status: 'success', data: cart });
    } catch (err: any) {
        logger.error('Get cart error', err.message);
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
};

export const updateCart = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).send({ status: 'error', message: 'Not authenticated' });
            return;
        }

        const { items } = req.body;

        if (!Array.isArray(items)) {
            res.status(400).send({ status: 'error', message: 'Items must be an array' });
            return;
        }

        const updatedCart = await cartService.updateCart(req.user.id, items);
        res.send({ status: 'success', data: updatedCart });
    } catch (err: any) {
        logger.error('Update cart error', err.message);
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
};
