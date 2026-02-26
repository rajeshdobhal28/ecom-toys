import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient, connectRedis } from '../utils/redisClient';
import { AuthRequest } from './auth';

// 100 requests per 15 minutes by default
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Limit each IP or User to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    store: new RedisStore({
        sendCommand: async (...args: string[]) => {
            if (!redisClient.isOpen) {
                await connectRedis();
            }
            return redisClient.sendCommand(args);
        },
    }),
    keyGenerator: (req, res) => {
        const authReq = req as AuthRequest;
        // Determine the key for rate limiting:
        // 1. If user is authenticated, use their user ID
        if (authReq.user && authReq.user.id) {
            return `user:${authReq.user.id}`;
        }
        // 2. Otherwise, fall back to the IP address using express-rate-limit's built-in helper
        return ipKeyGenerator(req.ip || 'unknown');
    },
    handler: (req, res) => {
        res.status(429).send({
            status: 'error',
            message: 'Too many requests, please try again later.',
        });
    },
});
