import * as db from '../db';
import logger from '../utils/logger';
import { redisClient } from '../utils/redisClient';

export const getProducts = async (filters: {
  category?: string;
  name?: string;
  slug?: string;
  isAdmin?: boolean;
}) => {
  try {
    const cacheKey = `products:all:${JSON.stringify(filters)}`;
    try {
      if (redisClient.isOpen) {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          logger.info(`[Redis] Cache hit for key: ${cacheKey}`);
          return JSON.parse(cached);
        }
      }
    } catch (redisErr) {
      logger.error(`[Redis] Error fetching cache for key ${cacheKey}`, redisErr);
      // Fall through to DB query
    }

    console.error('🔍 [DEBUG] getProducts FILTERS:', filters);
    let queryText = `
      SELECT 
        p.*, 
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN product_reviews r ON p.id = r.product_id
    `;
    const queryParams: any[] = [];
    const whereClauses: string[] = [];

    if (filters.category) {
      whereClauses.push(`p.category = $${queryParams.length + 1}`);
      queryParams.push(filters.category);
    }

    if (filters.name) {
      whereClauses.push(`p.name = $${queryParams.length + 1}`);
      queryParams.push(filters.name);
    }

    if (filters.slug) {
      whereClauses.push(`p.slug = $${queryParams.length + 1}`);
      queryParams.push(filters.slug);
    }

    if (whereClauses.length > 0) {
      queryText += ' WHERE ' + whereClauses.join(' AND ');
    }

    queryText += ' GROUP BY p.id';
    queryText += ' ORDER BY p.created_at DESC';

    console.error('🔍 [DEBUG] Executing Query:', queryText, queryParams);

    const res = await db.query(queryText, queryParams);
    console.error(`🔍 [DEBUG] Found ${res.rows.length} products`);

    let products = res.rows;
    if (!filters.isAdmin) {
      products = products.map(p => {
        const { cost_price, ...rest } = p;
        return rest;
      });
    }

    try {
      if (redisClient.isOpen) {
        // Cache products for 1 hour (3600 seconds)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(products));
        logger.info(`[Redis] Cached products for key: ${cacheKey}`);
      }
    } catch (redisErr) {
      logger.error(`[Redis] Error setting cache for key ${cacheKey}`, redisErr);
    }

    return products;
  } catch (err: any) {
    logger.error('Error fetching products', err);
    throw err;
  }
};

export const getTrendingProducts = async (isAdmin: boolean = false) => {
  try {
    const cacheKey = `products:trending:${isAdmin}`;
    try {
      if (redisClient.isOpen) {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          logger.info(`[Redis] Cache hit for trending products`);
          return JSON.parse(cached);
        }
      }
    } catch (redisErr) {
      logger.error(`[Redis] Error fetching cache for trending products`, redisErr);
    }

    const queryText = `
      SELECT 
        p.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count
      FROM products p
      JOIN (
          SELECT product_id, SUM(quantity) as total_sold
          FROM orders
          WHERE created_at >= NOW() - INTERVAL '24 HOURS'
          GROUP BY product_id
          ORDER BY total_sold DESC
          LIMIT 4
      ) top_selling ON p.id = top_selling.product_id
      LEFT JOIN product_reviews r ON p.id = r.product_id
      GROUP BY p.id, top_selling.total_sold
      ORDER BY top_selling.total_sold DESC;
    `;
    const res = await db.query(queryText);

    let products = res.rows;
    if (!isAdmin) {
      products = products.map(p => {
        const { cost_price, ...rest } = p;
        return rest;
      });
    }

    try {
      if (redisClient.isOpen) {
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(products));
        logger.info(`[Redis] Cached trending products`);
      }
    } catch (redisErr) {
      logger.error(`[Redis] Error setting cache for trending products`, redisErr);
    }

    return products;
  } catch (err: any) {
    logger.error('Error fetching trending products', err);
    throw err;
  }
};
