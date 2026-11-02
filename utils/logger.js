const fs = require('fs');
const path = require('path');
const winston = require('winston');

const isProduction = process.env.NODE_ENV === 'production';
const logDirectory = path.join(__dirname, '..', 'logs');

if (!isProduction && !fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    if (stack) {
      return `${timestamp} [${level.toUpperCase()}] ${message}\n${stack}`;
    }
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
  })
);

const transports = [];

if (!isProduction) {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDirectory, 'combined.log'),
      level: 'info'
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error'
    })
  );
}

transports.push(
  new winston.transports.Console({
    format: logFormat
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports
});

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

module.exports = logger;
