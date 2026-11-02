const mongoose = require('mongoose');
const logger = require('../utils/logger');

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    if (!connectionPromise) {
      connectionPromise = (mongoose.connection.asPromise ? mongoose.connection.asPromise() : Promise.resolve(mongoose.connection))
        .catch((error) => {
          connectionPromise = null;
          logger.error(`MongoDB connection failed: ${error.message}`);
          throw error;
        })
        .finally(() => {
          connectionPromise = null;
        });
    }

    return await connectionPromise;
  }

  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined in the environment variables.');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoURI)
      .then(() => {
        logger.info('MongoDB connected successfully');
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        logger.error(`MongoDB connection failed: ${error.message}`);
        throw error;
      })
      .finally(() => {
        connectionPromise = null;
      });
  }

  return await connectionPromise;
};

module.exports = connectDB;
