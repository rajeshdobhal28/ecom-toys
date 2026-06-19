import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
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

    // Stock is reserved at payment success (not at order creation). The customer
    // has already paid, so a stock shortfall must not fail this request — log and
    // continue rather than surfacing an error.
    try {
      await orderService.decrementStockForOrder(order);
    } catch (stockErr) {
      logger.error('Failed to decrement stock after successful payment', stockErr);
    }

    // Send order confirmation email after successful payment
    orderService.sendOrderConfirmation(order);

    res.status(200).send({ status: 'success', data: {order_id: razorpay_order_id }});
  } catch (err: any) {
    logger.error('Payment verification error', err.message);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
};

const validateOrderPayment = (products: Array<any>, addressId: string) => {
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
        valid: false,
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

      const validationResp = validateOrderPayment(products, addressId);

      if (!validationResp.valid) {
        res.status(400).send({
          status: 'error',
          message: validationResp.message
        });
        return;
      }


      // 1. Create the order first. createOrder computes the authoritative
      // total from the locked product rows — the single source of truth for
      // pricing — so the gateway is charged exactly what the order stores.
      const order = await orderService.createOrder({
        userId: req.user.id,
        userEmail: req.user.email,
        addressId,
        items: products.map((p: any) => ({
          productId: p.productId,
          quantity: Number(p.quantity),
        })),
        status: 'Processing',
        payment_status: 'processing',
        payment_gateway: 'razorpay',
      });

      // 2. Open the gateway order for exactly that total.
      const rzpOrder = await createRazorPayOrder(
        Number(order.total_price),
        `${order.id}`
      );
      if(rzpOrder.error) {
        // log error
        res.status(500).send({
          status: 'error',
          message: 'Error occured during payment please try again later.'
        });
        return;
      }

      // 3. Link the gateway order id back so payment verification can find it.
      await orderService.setOrderPaymentOrderId(order.id, rzpOrder.id);

      res.status(201).send({
        status: 'success', data: {
          key: process.env.PAYMENT_API_KEY, // Replace with your Razorpay key_id
          amount: rzpOrder.amount, // Amount is in currency subunits.
          currency: rzpOrder.currency,
          name: process.env.COMPANY_NAME,
          description: `Payment for user ${req.user.email}`,
          order_id: rzpOrder.id, // This is the order_id created in the backend
          prefill: {
            name: req.user.name,
            email: req.user.email,
          },
          // theme: {
          //   color: '#F37254'
          // },
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
