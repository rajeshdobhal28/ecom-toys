import app from './app';
import config from './config';
import logger from './utils/logger';
import { connectRedis } from './utils/redisClient';

const startServer = async () => {
  try {
    await connectRedis();
  } catch (err) {
    logger.error('Failed to connect to Redis during startup, continuing without cache.', err);
  }

  app.listen(config.port, () => {
    logger.info(`🚀 Server running at http://localhost:${config.port}`);
    logger.info(`📝 Logs should appear here...`);
  });
};

startServer();
