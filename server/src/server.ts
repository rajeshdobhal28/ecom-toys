import app from './app';
import config from './config';
import logger from './utils/logger';
import { connectRedis } from './utils/redisClient';

connectRedis().then(() => {
  app.listen(config.port, () => {
    logger.info(`🚀 Server running at http://localhost:${config.port}`);
    logger.info(`📝 Logs should appear here...`);
  });
}).catch(err => {
  logger.error('Failed to connect to Redis', err);
});
