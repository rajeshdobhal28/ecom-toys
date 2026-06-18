import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import { getProducts } from '../services/productService';
import { createRazorPayOrder, verifyRazorPayPaymentSignature } from '../services/razorPayService';
import logger from '../utils/logger';

import { UserPayload } from '../middlewares/auth';

// Custom Request interface to include user from auth middleware
interface AuthRequest extends Request {
  user?: UserPayload;
}


export const razorPayPaymentSuccess = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res
        .status(400)
        .send({ status: 'error', message: 'Missing payment verification fields' });
      return;
    }

    const isValid = verifyRazorPayPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      // Mark the order as failed so it isn't left dangling in 'processing'
      await orderService.updateOrderPaymentStatus(razorpay_order_id, 'failed');
      res
        .status(400)
        .send({ status: 'error', message: 'Payment verification failed' });
      return;
    }

    const order = await orderService.updateOrderPaymentStatus(
      razorpay_order_id,
      'completed',
      razorpay_payment_id,
      razorpay_signature
    );

    if (!order) {
      res
        .status(404)
        .send({ status: 'error', message: 'Order not found for this payment' });
      return;
    }

    // Send order confirmation email after successful payment
    orderService.sendOrderConfirmation(order);

    res.status(200).send({ status: 'success', data: {order_id: razorpay_order_id }});
  } catch (err: any) {
    logger.error('Payment verification error', err.message);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
};

const validateOrderPayment = async (products: Array<any>, addressId: string, userId: string) => {
  if (!products || !Array.isArray(products) || products.length === 0) {
    return {
      valid: false,
      message: 'Products array is required and must not be empty',
    }
  }

  if (!addressId) {
    return {
      valid: false,
      message: 'Delivery address is required',
    }
  }

  // Validate structure of each product
  for (const item of products) {
    if (!item.productId || !item.quantity) {
      return {
        status: 'error',
        message: 'Each product must have a productId and quantity',
      }
    }
  }

  return { valid: true };
}

  export const createOrderPayment = async (
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

      const validationResp = await validateOrderPayment(products, addressId, req.user.id);

      if (!validationResp.valid) {
        res.status(400).send({
          status: 'error',
          message: validationResp.message
        });
        return;
      }


      // fetch product from database for payment
      const requestedProducts: any = {};
      const prodIds = products.map((item: any) => {
        requestedProducts[item.productId] = item;
        return item.productId;
      });

      const dbProducts = await getProducts({ ids: prodIds }, true);
      let totalAmount: number = 0;
      dbProducts.forEach((prod: any) => {
        totalAmount += (prod.discounted_price || prod.price) * requestedProducts[prod.id].quantity;
      });

      const rzpOrder = await createRazorPayOrder(totalAmount, `reciept111_${Date.now()}`);

      await orderService.createOrder({
        userId: req.user.id,
        userEmail: req.user.email,
        addressId,
        items: products.map((p: any) => ({
          productId: p.productId,
          quantity: Number(p.quantity),
        })),
        total_price: rzpOrder.amount / 100, // in rs
        status: 'Processing',
        payment_status: 'processing',
        payment_gateway: 'razorpay',
        payment_order_id: rzpOrder.id,
      });

      res.status(201).send({
        status: 'success', data: {
          key: process.env.PAYMENT_API_KEY, // Replace with your Razorpay key_id
          amount: rzpOrder.amount, // Amount is in currency subunits.
          currency: rzpOrder.currency,
          name: process.env.COMPANY_NAME,
          description: 'Test Transaction',
          order_id: rzpOrder.id, // This is the order_id created in the backend
          prefill: {
            name: 'Rajesh Kumar',
            email: req.user.email,
            contact: '+917838943334'
          },
          theme: {
            color: '#F37254'
          },
        }
      });

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
