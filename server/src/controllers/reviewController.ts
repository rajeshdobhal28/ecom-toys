import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as reviewService from '../services/reviewService';
import logger from '../utils/logger';

export const upsertReview = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).send({ status: 'error', message: 'Not authenticated' });
            return;
        }
        const { productId, rating, comment } = req.body;

        if (!productId || !rating) {
            res.status(400).send({ status: 'error', message: 'Missing required fields' });
            return;
        }

        if (rating < 1 || rating > 5) {
            res.status(400).send({ status: 'error', message: 'Rating must be between 1 and 5' });
            return;
        }

        const review = await reviewService.upsertReview(req.user.id, productId, rating, comment || '');
        res.send({ status: 'success', data: review });
    } catch (err: any) {
        logger.error('Upsert review error', err.message);
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
};

export const getReviewsByProduct = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const productId = req.params.productId as string;

        if (!productId) {
            res.status(400).send({ status: 'error', message: 'Missing product ID' });
            return;
        }

        const reviews = await reviewService.getReviewsByProduct(productId);
        res.send({ status: 'success', data: reviews });
    } catch (err: any) {
        logger.error('Get reviews by product error', err.message);
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
};

export const getReviewsByUser = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).send({ status: 'error', message: 'Not authenticated' });
            return;
        }

        const reviews = await reviewService.getReviewsByUser(req.user.id);
        res.send({ status: 'success', data: reviews });
    } catch (err: any) {
        logger.error('Get reviews by user error', err.message);
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
};
