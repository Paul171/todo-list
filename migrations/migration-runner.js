/**
 * Migration Runner
 * 
 * This script runs all migration files in sequence to set up or update the database schema.
 * It keeps track of which migrations have already been applied using a migrations table.
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Database configuration (same as in server.js)
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todolist'
};

// Initialize the migration system
async function initMigrationSystem() {
  try {
    // First create the database if it doesn't exist
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();
    
    // Connect to the database
    const pool = mysql.createPool(dbConfig);
    
    // Create migrations table if it doesn't exist
    const createMigrationsTable = `
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await pool.query(createMigrationsTable);
    console.log('Migration system initialized');
    
    return pool;
  } catch (error) {
    console.error('Error initializing migration system:', error);
    process.exit(1);
  }
}

// Run all pending migrations
async function runMigrations() {
  const pool = await initMigrationSystem();
  
  try {
    // Get list of applied migrations
    const [appliedMigrations] = await pool.query('SELECT name FROM migrations');
    const appliedMigrationNames = appliedMigrations.map(m => m.name);
    
    // Get all migration files from the migrations directory
    const migrationFiles = await fs.readdir(__dirname);
    
    // Filter to only .js files and exclude this runner file
    const pendingMigrations = migrationFiles
      .filter(file => file.endsWith('.js') && file !== 'migration-runner.js')
      .filter(file => !appliedMigrationNames.includes(file))
      .sort(); // Apply migrations in alphabetical order
    
    if (pendingMigrations.length === 0) {
      console.log('No pending migrations to apply');
      await pool.end();
      return;
    }
    
    console.log(`Found ${pendingMigrations.length} pending migrations`);
    
    // Run each pending migration
    for (const migrationFile of pendingMigrations) {
      console.log(`Applying migration: ${migrationFile}`);
      
      // Load and run the migration
      const migration = require(path.join(__dirname, migrationFile));
      await migration.up(pool);
      
      // Mark migration as applied
      await pool.query('INSERT INTO migrations (name) VALUES (?)', [migrationFile]);
      
      console.log(`Successfully applied migration: ${migrationFile}`);
    }
    
    console.log('All migrations successfully applied');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations().catch(err => {
    console.error('Migration runner failed:', err);
    process.exit(1);
  });
}

module.exports = { runMigrations };
