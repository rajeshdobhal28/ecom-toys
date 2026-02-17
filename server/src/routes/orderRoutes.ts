import express from 'express';
import * as orderController from '../controllers/orderController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Apply auth middleware to all order routes
router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);

export default router;
