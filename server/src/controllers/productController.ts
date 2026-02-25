import { Request, Response } from 'express';
import * as productService from '../services/productService';
import logger from '../utils/logger';
import { AuthRequest } from '../middlewares/auth';

export const getProducts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const category = req.query.category as string | undefined;
    const name = req.query.name as string | undefined;
    const slug = req.query.slug as string | undefined;
    const isAdmin = req.user?.isAdmin || false;

    const products = await productService.getProducts({ category, name, slug, isAdmin });

    res.send({ status: 'success', data: products });
  } catch (err: any) {
    logger.error('Get products error', err.message);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
};

export const getTrendingProducts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const isAdmin = req.user?.isAdmin || false;
    const trendingProducts = await productService.getTrendingProducts(isAdmin);
    res.send({ status: 'success', data: trendingProducts });
  } catch (err: any) {
    logger.error('Get trending products error', err.message);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
};
