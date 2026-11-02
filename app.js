const path = require('path');
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swagger');
const logger = require('./utils/logger');
const connectDB = require('./config/db');
const tourRoutes = require('./routes/tourRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

const ensureTourDbConnection = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};

app.use('/tour', ensureTourDbConnection);
app.use('/tour', tourRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
