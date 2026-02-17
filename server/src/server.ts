import app from './app';
import config from './config';
import logger from './utils/logger';

app.listen(config.port, () => {
    logger.info(`🚀 Server running at http://localhost:${config.port}`);
    logger.info(`📝 Logs should appear here...`);
});
