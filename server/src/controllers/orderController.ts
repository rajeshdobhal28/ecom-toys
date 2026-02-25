import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import logger from '../utils/logger';

import { UserPayload } from '../middlewares/auth';

// Custom Request interface to include user from auth middleware
interface AuthRequest extends Request {
  user?: UserPayload;
}

export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { products, addressId } = req.body;

    if (!req.user) {
      res
        .status(401)
        .send({ status: 'error', message: 'User not authenticated' });
      return;
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      res
        .status(400)
        .send({
          status: 'error',
          message: 'Products array is required and must not be empty',
        });
      return;
    }

    if (!addressId) {
      res
        .status(400)
        .send({
          status: 'error',
          message: 'Delivery address is required',
        });
      return;
    }

    // Validate structure of each product
    for (const item of products) {
      if (!item.productId || !item.quantity) {
        res
          .status(400)
          .send({
            status: 'error',
            message: 'Each product must have a productId and quantity',
          });
        return;
      }
    }

    const orders = await orderService.createOrder({
      userId: req.user.id,
      userEmail: req.user.email,
      addressId,
      products: products.map((p) => ({
        productId: p.productId,
        quantity: Number(p.quantity),
      })),
    });

    res.status(201).send({ status: 'success', data: orders });
  } catch (err: any) {
    logger.error('Create order error', err.message);
    if (err.message && err.message.startsWith('Product not found')) {
      res.status(404).send({ status: 'error', message: err.message });
    } else if (err.message && err.message.startsWith('Insufficient stock')) {
      res.status(400).send({ status: 'error', message: err.message });
    } else if (err.message && err.message.startsWith('Sorry, we currently only deliver to pincodes')) {
      res.status(400).send({ status: 'error', message: err.message });
    } else {
      res
        .status(500)
        .send({ status: 'error', message: 'Internal Server Error' });
    }
  }
};

export const getOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res
        .status(401)
        .send({ status: 'error', message: 'User not authenticated' });
      return;
    }

    const orders = await orderService.getOrders(req.user.id);
    res.send({ status: 'success', data: orders });
  } catch (err: any) {
    logger.error('Get orders error', err.message);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
};
