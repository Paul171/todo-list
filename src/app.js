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

// API Routes
app.use('/api/todos', todoRoutes);

// Serve React app for any other route (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

module.exports = app;
