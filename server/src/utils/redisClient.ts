import { createClient } from 'redis';
import logger from './logger';

export const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

// Initialize connection (it's safe to call multiple times in development but usually we await it once at startup)
export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (err) {
        logger.error('Failed to connect to Redis', err);
    }
};

// Utility to clear all product-related cache keys
export const clearProductCache = async () => {
    await connectRedis();

    logger.info('Clearing product cache');
    if (!redisClient.isOpen) {
        return; // Silently abort cache invalidation if Redis isn't up
    }

    try {
        // Fetch all keys matching products:*
        const keys = await redisClient.keys('products:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
            logger.info(`Cleared ${keys.length} product cache keys`);
        }
    } catch (err) {
        logger.error('Error clearing product cache', err);
    }
};
