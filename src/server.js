// Load environment variables from .env file
require('dotenv').config();

const app = require('./app');
const { initDatabase } = require('./config/db');

const PORT = process.env.PORT || 3000;

// Initialize database before starting the server
async function startServer() {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database or start server:', err);
  }
}

startServer();
