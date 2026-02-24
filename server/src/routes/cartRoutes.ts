import express from 'express';
import * as cartController from '../controllers/cartController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Both routes are strictly authenticated
router.get('/', authenticate, cartController.getCart);
router.put('/', authenticate, cartController.updateCart);

export default router;
