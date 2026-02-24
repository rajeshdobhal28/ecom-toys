import * as db from '../db';
import logger from '../utils/logger';

export const getProducts = async (filters: {
  category?: string;
  name?: string;
  isAdmin?: boolean;
}) => {
  try {
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

    return products;
  } catch (err: any) {
    logger.error('Error fetching products', err);
    throw err;
  }
};

export const getTrendingProducts = async (isAdmin: boolean = false) => {
  try {
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

    return products;
  } catch (err: any) {
    logger.error('Error fetching trending products', err);
    throw err;
  }
};
