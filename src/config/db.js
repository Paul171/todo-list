const mysql = require('mysql2/promise');

// Database configuration with fallbacks for local development
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'todolist',
  ssl: process.env.DB_SSL ? {
    rejectUnauthorized: false // Needed for some cloud database providers
  } : false
};

// Create connection pool with configurable pool size
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: process.env.DB_POOL_LIMIT || 10,
  queueLimit: 0
});

// Initialize the database and create table if not exists
async function initDatabase() {
  try {
    // Check if database exists, if not create it
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();
    
    // Create todos table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await pool.query(createTableQuery);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

module.exports = {
  pool,
  initDatabase,
  dbConfig
};
