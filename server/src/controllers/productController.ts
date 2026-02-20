import { Request, Response } from 'express';
import * as productService from '../services/productService';
import logger from '../utils/logger';

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = req.query.category as string | undefined;
    const name = req.query.name as string | undefined;

    const products = await productService.getProducts({ category, name });

    res.send({ status: 'success', data: products });
  } catch (err: any) {
    logger.error('Get products error', err.message);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
};

export const getTrendingProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trendingProducts = await productService.getTrendingProducts();
    res.send({ status: 'success', data: trendingProducts });
  } catch (err: any) {
    logger.error('Get trending products error', err.message);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
};
