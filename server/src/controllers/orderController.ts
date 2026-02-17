import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import logger from '../utils/logger';

// Custom Request interface to include user from auth middleware
interface AuthRequest extends Request {
    user?: any;
}

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { productId, quantity } = req.body;

        if (!req.user) {
            res.status(401).send({ status: 'error', message: 'User not authenticated' });
            return;
        }

        if (!productId || !quantity) {
            res.status(400).send({ status: 'error', message: 'Product ID and quantity are required' });
            return;
        }

        const order = await orderService.createOrder({
            userId: req.user.id,
            userEmail: req.user.email,
            productId,
            quantity: Number(quantity)
        });

        res.status(201).send({ status: 'success', data: order });

    } catch (err: any) {
        logger.error('Create order error', err.message);
        if (err.message === 'Product not found') {
            res.status(404).send({ status: 'error', message: 'Product not found' });
        } else if (err.message === 'Insufficient stock') {
            res.status(400).send({ status: 'error', message: 'Insufficient stock' });
        } else {
            res.status(500).send({ status: 'error', message: 'Internal Server Error' });
        }
    }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).send({ status: 'error', message: 'User not authenticated' });
            return;
        }

        const orders = await orderService.getOrders(req.user.id);
        res.send({ status: 'success', data: orders });

    } catch (err: any) {
        logger.error('Get orders error', err.message);
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
};
