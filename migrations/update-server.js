/**
 * Server Update Script
 * 
 * This script modifies the server.js file to use the migration system
 * instead of inline database initialization.
 */

const fs = require('fs');
const path = require('path');

const serverFilePath = path.join(__dirname, '..', 'server.js');

// Read the current server.js content
console.log('Reading server.js...');
let serverContent = fs.readFileSync(serverFilePath, 'utf8');

// Replace the initDatabase function with code to run migrations
console.log('Updating server.js to use migration system...');

// Find the initDatabase function
const initDatabaseRegex = /\/\/ Initialize the database and create table if not exists\nasync function initDatabase\(\) \{[\s\S]*?\}/;

// Create the new code that uses migrations instead
const newInitFunction = `// Initialize the database using migrations
async function initDatabase() {
  try {
    // Run migrations to ensure database and tables are set up
    const { runMigrations } = require('./migrations/migration-runner');
    await runMigrations();
    console.log('Database initialized successfully via migrations');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}`;

// Replace the old initialization function with the new one
const updatedContent = serverContent.replace(initDatabaseRegex, newInitFunction);

// Write the updated content back to server.js
fs.writeFileSync(serverFilePath, updatedContent);
console.log('Updated server.js successfully!');
console.log('The server now uses the migration system for database initialization.');
