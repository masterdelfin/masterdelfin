const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS – allow all origins in development
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Mount all API routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
