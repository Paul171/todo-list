# Database Migration System

This directory contains a migration system for managing database schema changes in a structured, version-controlled way. The migration system allows you to:

1. Track database schema changes over time
2. Apply pending migrations automatically
3. Ensure consistent database schema across development, staging, and production environments
4. Roll back changes if needed

## How It Works

The migration system consists of:

- **migration-runner.js**: Core script that runs migrations in sequence and tracks applied migrations
- **Numbered migration files**: Individual migration scripts (e.g., `001-create-todos-table.js`)

Each migration file exports two functions:
- `up()`: Applies the migration (creates/alters tables, adds indexes, etc.)
- `down()`: Reverses the migration (useful for rollbacks)

## Migration Files

This directory includes the following migration files:

1. **001-create-todos-table.js**: Creates the initial todos table
2. **002-add-priority-field.js**: Adds a priority field to todos
3. **003-add-indexes.js**: Adds performance indexes to the todos table

## How to Run Migrations

Run all pending migrations:

```bash
node migrations/migration-runner.js
```

## Creating New Migrations

To create a new migration:

1. Create a new file with a numbered prefix (e.g., `004-your-migration-name.js`)
2. Follow the existing pattern with `up()` and `down()` functions
3. Implement the schema changes in the `up()` function
4. Implement the reverse operations in the `down()` function

Example template:

```javascript
async function up(pool) {
  // Your schema changes here
  const query = `
    ALTER TABLE your_table
    ADD COLUMN your_column your_type
  `;
  
  await pool.query(query);
  console.log('Applied your changes');
}

async function down(pool) {
  // How to reverse the changes
  await pool.query('ALTER TABLE your_table DROP COLUMN your_column');
  console.log('Reverted your changes');
}

module.exports = { up, down };
```

## Updating Server.js to Use Migrations

We've included a utility script to update your server.js to use the migration system:

```bash
node migrations/update-server.js
```

This will replace the inline database initialization with code that uses the migration system.

## Benefits

- **Versioning**: Track database changes in version control
- **Reproducibility**: Ensure consistent database schema across environments
- **Safety**: Automatic tracking of applied migrations prevents duplicate runs
- **Rollback**: Ability to undo changes if needed
- **Documentation**: Self-documenting database schema history
