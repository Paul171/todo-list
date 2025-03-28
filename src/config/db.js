const mysql = require('mysql2/promise');
const { parse } = require('url');

// Parse a MySQL connection string if provided
function parseConnectionString(connectionString) {
  if (!connectionString || !connectionString.includes('mysql://')) {
    return null;
  }
  
  try {
    // Parse the URL
    const parsedUrl = new URL(connectionString);
    
    return {
      host: parsedUrl.hostname,
      port: parsedUrl.port ? parseInt(parsedUrl.port) : 3306,
      user: parsedUrl.username,
      password: parsedUrl.password,
      database: parsedUrl.pathname.replace('/', ''),
      ssl: { rejectUnauthorized: false } // Always use SSL for Railway
    };
  } catch (error) {
    console.error('Failed to parse MySQL connection string:', error);
    return null;
  }
}

// Try to use the connection string first, then fall back to individual parameters
const connectionString = process.env.MYSQL_PUBLIC_URL || process.env.DATABASE_URL;
const parsedConfig = parseConnectionString(connectionString);

// Database configuration with fallbacks for local development
const dbConfig = parsedConfig || {
  host: process.env.DB_HOST || 'gondola.proxy.rlwy.net',
  port: parseInt(process.env.DB_PORT || '12442'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'UZXvQgetqzklDuinMGdWkpHiOHUoZESF',
  database: process.env.DB_NAME || 'railway',
  ssl: { rejectUnauthorized: false } // Always use SSL for Railway
};

console.log('Connecting with:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  ssl: dbConfig.ssl ? 'enabled' : 'disabled'
});

// Create connection pool with configurable pool size
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_POOL_LIMIT || '10'),
  queueLimit: 0,
  connectTimeout: 60000 // Increase timeout to 60 seconds
});

// Initialize the database and create table if not exists
async function initDatabase() {
  try {
    // Check if database exists, if not create it
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
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
