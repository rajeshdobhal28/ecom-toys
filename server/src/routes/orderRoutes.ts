import express from 'express';
import * as orderController from '../controllers/orderController';
import { authenticate } from '../middlewares/auth';
import { paymentRateLimiter } from '../middlewares/rateLimiter';

const router = express.Router();

// Apply auth middleware to all order routes
router.use(authenticate);

router.get('/', orderController.getOrders);
router.post('/payment', paymentRateLimiter, orderController.createOrderPayment);
router.post('/razorpay/payment-success', paymentRateLimiter, orderController.razorPayPaymentSuccess)

export default router;
