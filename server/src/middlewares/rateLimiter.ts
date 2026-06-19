import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient, connectRedis } from '../utils/redisClient';
import { AuthRequest } from './auth';

// Key by authenticated user id when available, otherwise fall back to IP.
const keyGenerator = (req: any) => {
    const authReq = req as AuthRequest;
    if (authReq.user && authReq.user.id) {
        return `user:${authReq.user.id}`;
    }
    return ipKeyGenerator(req.ip || 'unknown');
};

const handler = (req: any, res: any) => {
    res.status(429).send({
        status: 'error',
        message: 'Too many requests, please try again later.',
    });
};

// Each limiter needs a distinct Redis key prefix, otherwise limiters sharing
// the same key (e.g. the same user id) would increment the same counter.
const createLimiter = (max: number, prefix: string) =>
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max,
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        store: new RedisStore({
            sendCommand: async (...args: string[]) => {
                if (!redisClient.isOpen) {
                    await connectRedis();
                }
                return redisClient.sendCommand(args);
            },
            prefix,
        }),
        keyGenerator,
        handler,
    });

// 100 requests per 15 minutes for general API traffic.
export const apiRateLimiter = createLimiter(100, 'rl:api:');

// Tighter limit for payment endpoints (order creation + signature verification).
// These are sensitive and abuse-prone, so cap them well below the general API.
export const paymentRateLimiter = createLimiter(20, 'rl:payment:');
