import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import cartRoutes from './routes/cartRoutes';
import reviewRoutes from './routes/reviewRoutes';
import addressRoutes from './routes/addressRoutes';
import contactRoutes from './routes/contactRoutes';
import logger from './utils/logger';
import { apiRateLimiter } from './middlewares/rateLimiter';
import { optionalAuthenticate } from './middlewares/auth';
import chatRoutes from './routes/chatRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Apply optional authentication globally to populate req.user for rate limiting
app.use('/api/', optionalAuthenticate);

// Apply rate limiting to all /api/ routes
app.use('/api/', apiRateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

// Error handling (basic)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error('Unhandled Error', err);
    res.status(500).send({ status: 'error', message: 'Something went wrong!' });
  }
);

export default app;
