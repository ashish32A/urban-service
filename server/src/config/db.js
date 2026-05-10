const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB using Mongoose.
 * Retries up to 3 times with exponential backoff on failure.
 */
const connectDB = async (retries = 3) => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(uri, options);
      logger.info(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

      // Connection event listeners
      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
      });

      return conn;
    } catch (error) {
      logger.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);

      if (attempt === retries) {
        throw new Error(`Could not connect to MongoDB after ${retries} attempts: ${error.message}`);
      }

      // Exponential backoff: 2s, 4s, 8s
      const delay = Math.pow(2, attempt) * 1000;
      logger.info(`Retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectDB;
