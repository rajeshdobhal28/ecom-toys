import express from 'express';
import * as reviewController from '../controllers/reviewController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/', authenticate, reviewController.upsertReview);
router.get('/user', authenticate, reviewController.getReviewsByUser);

// Kept public so any visitor can read product reviews
router.get('/product/:productId', reviewController.getReviewsByProduct);

export default router;
