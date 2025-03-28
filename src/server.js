// Load environment variables from .env file
require('dotenv').config();

const app = require('./app');
const { initDatabase } = require('./config/db');

const PORT = process.env.PORT || 3000;

// Initialize database before starting the server with retry mechanism
async function startServer() {
  let retries = 5;
  let connected = false;
  
  while (retries > 0 && !connected) {
    try {
      console.log(`Attempting to connect to database (${retries} retries left)...`);
      await initDatabase();
      connected = true;
      console.log('Database initialized successfully');
      
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('Failed to initialize database:', err.message);
      retries--;
      
      if (retries === 0) {
        console.error('Maximum retries reached. Starting server without database...');
        // Mark database as unavailable for the health check
        app.locals.databaseAvailable = false;
        
        app.listen(PORT, () => {
          console.log(`Server running on http://localhost:${PORT} (without database)`);
        });
      } else {
        // Wait 5 seconds before retrying
        console.log('Retrying in 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
}

startServer();
