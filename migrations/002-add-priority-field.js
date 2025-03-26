/**
 * Migration: Add Priority Field
 * 
 * This migration adds a priority field to the todos table.
 * It demonstrates how to alter an existing table to add new columns.
 */

async function up(pool) {
  const addPriorityField = `
    ALTER TABLE todos
    ADD COLUMN priority ENUM('low', 'medium', 'high') DEFAULT 'medium'
  `;
  
  await pool.query(addPriorityField);
  console.log('Added priority field to todos table');
}

async function down(pool) {
  // Roll back the changes made in the 'up' function
  await pool.query('ALTER TABLE todos DROP COLUMN priority');
  console.log('Removed priority field from todos table');
}

module.exports = { up, down };
