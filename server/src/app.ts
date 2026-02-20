import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import logger from './utils/logger';

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

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
