const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode >= 500) {
    logger.error(`Unexpected error on ${req.method} ${req.originalUrl}: ${message}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} failed: ${message}`);
  }

  const response = {
    success: false,
    message
  };

  if (process.env.NODE_ENV === 'development' && statusCode >= 500 && err.stack) {
    response.stack = err.stack;
  }

  if (err.errors && Array.isArray(err.errors)) {
    response.errors = err.errors;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler
};
