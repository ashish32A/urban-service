require('dotenv').config();
const { createServer } = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const { initSocket } = require('./socket');
const { validateEnv } = require('./config/validateEnv');

// Validate required env vars before anything else
validateEnv();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const httpServer = createServer(app);
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`🔌 Socket.IO initialized`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => { logger.error('Unhandled Rejection:', err); process.exit(1); });
process.on('uncaughtException', (err) => { logger.error('Uncaught Exception:', err); process.exit(1); });

startServer();
