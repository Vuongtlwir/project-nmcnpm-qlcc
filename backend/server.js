require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const apiRoutes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorMiddleware');
const loggerMiddleware = require('./src/middlewares/loggerMiddleware');
const response = require('./src/utils/response');
const db = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// API routes mount point
app.use('/api/v1', apiRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Handle 404 Route Not Found
app.use((req, res) => {
  return response.error(res, 'Requested resource not found', 'NOT_FOUND', null, 404);
});

// Global Error Handler middleware
app.use(errorHandler);

// Start the server
const startServer = async () => {
  try {
    // Verify DB connection before starting
    const conn = await db.getConnection();
    conn.release();
  } catch (err) {
    console.error('Unable to connect to database. Server will not start.', err.message || err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`Address: http://localhost:${PORT}`);
    console.log(`========================================`);
  });
};

startServer();
