/**
 * Migration: Add Indexes
 * 
 * This migration adds indexes to improve query performance.
 * It demonstrates how to add indexes to an existing table.
 */

async function up(pool) {
  // Add index on completed field for filtering completed/incomplete todos
  const addCompletedIndex = `
    CREATE INDEX idx_completed ON todos (completed)
  `;
  
  // Add index on createdAt field for sorting by creation date
  const addCreatedAtIndex = `
    CREATE INDEX idx_created_at ON todos (createdAt)
  `;
  
  await pool.query(addCompletedIndex);
  console.log('Added index on completed field');
  
  await pool.query(addCreatedAtIndex);
  console.log('Added index on createdAt field');
}

async function down(pool) {
  // Roll back the changes made in the 'up' function
  await pool.query('DROP INDEX idx_completed ON todos');
  console.log('Removed index on completed field');
  
  await pool.query('DROP INDEX idx_created_at ON todos');
  console.log('Removed index on createdAt field');
}

module.exports = { up, down };
