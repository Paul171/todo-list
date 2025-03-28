const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// Import routes
const todoRoutes = require('./routes/todoRoutes');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Health check endpoint for container orchestration systems
app.get('/health', async (req, res) => {
  try {
    // Check if database is marked as unavailable by server.js retry logic
    if (app.locals.databaseAvailable === false) {
      return res.status(200).json({ 
        status: 'warning',
        message: 'Application is running but database connection failed',
        database: 'unavailable'
      });
    }
    
    // Database wasn't marked as unavailable, so return healthy status
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Service is healthy',
      database: 'available'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(200).json({ 
      status: 'warning',
      message: 'Health check encountered an error',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/todos', todoRoutes);

// Serve React app for any other route (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

module.exports = app;
