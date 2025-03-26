/**
 * Initial Migration: Create Todos Table
 * 
 * This migration creates the initial todos table structure.
 */

async function up(pool) {
  const createTodosTable = `
    CREATE TABLE IF NOT EXISTS todos (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT false,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  await pool.query(createTodosTable);
  console.log('Created todos table');
}

async function down(pool) {
  // In a real production environment, you might want to be careful with DROP TABLE
  // operations. Here we're providing it for completeness.
  await pool.query('DROP TABLE IF EXISTS todos');
  console.log('Dropped todos table');
}

module.exports = { up, down };
