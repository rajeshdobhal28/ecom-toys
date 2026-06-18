import express from 'express';
import * as orderController from '../controllers/orderController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Apply auth middleware to all order routes
router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.post('/payment', orderController.createOrderPayment);
router.post('/razorpay/payment-success', orderController.razorPayPaymentSuccess)

export default router;
