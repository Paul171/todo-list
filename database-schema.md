# Todo List Database Schema

## Overview

The database schema for the Todo List application consists of one main table (`todos`) that stores all task information. The schema has evolved through several migrations, each adding new features and optimizations.

## Tables

### `todos` Table

This is the primary table for storing todo items.

| Column      | Type                         | Constraints                | Description                                               |
|-------------|-----------------------------|----------------------------|-----------------------------------------------------------|
| id          | VARCHAR(36)                 | PRIMARY KEY                | Unique identifier for each todo item (UUID format)        |
| title       | VARCHAR(255)                | NOT NULL                   | The title or short description of the todo item           |
| description | TEXT                        |                            | Detailed description of the todo item (optional)          |
| completed   | BOOLEAN                     | DEFAULT false              | Flag indicating whether the todo item is completed        |
| createdAt   | TIMESTAMP                   | DEFAULT CURRENT_TIMESTAMP  | When the todo item was created                            |
| priority    | ENUM('low', 'medium', 'high') | DEFAULT 'medium'          | Priority level of the todo item                           |

### `migrations` Table

This table tracks which database migrations have been applied.

| Column     | Type                       | Constraints                | Description                                               |
|------------|----------------------------|----------------------------|-----------------------------------------------------------|
| id         | INT                        | AUTO_INCREMENT PRIMARY KEY | Unique identifier for each migration record               |
| name       | VARCHAR(255)               | NOT NULL                   | Name of the migration file that was applied               |
| applied_at | TIMESTAMP                  | DEFAULT CURRENT_TIMESTAMP  | When the migration was applied                            |

## Indexes

The database uses the following indexes to optimize query performance:

| Index Name       | Table    | Columns   | Type    | Description                                           |
|------------------|----------|-----------|---------|-------------------------------------------------------|
| PRIMARY          | todos    | id        | PRIMARY | Primary key index on the id column                    |
| idx_completed    | todos    | completed | INDEX   | Index on completed status for filtering todos         |
| idx_created_at   | todos    | createdAt | INDEX   | Index on creation date for sorting todos by date      |

## SQL Schema Definition

Here is the complete SQL definition for the current schema:

```sql
-- Create the todos table
CREATE TABLE IF NOT EXISTS todos (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium'
);

-- Create indexes for performance optimization
CREATE INDEX idx_completed ON todos (completed);
CREATE INDEX idx_created_at ON todos (createdAt);

-- Create migrations table to track applied migrations
CREATE TABLE IF NOT EXISTS migrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Schema Evolution

The schema evolved through the following migrations:

1. Initial migration (`001-create-todos-table.js`): Created the basic todos table with id, title, description, completed, and createdAt fields.

2. Add priority field (`002-add-priority-field.js`): Added a priority field to enable categorizing todos by importance (low, medium, high).

3. Add indexes (`003-add-indexes.js`): Added performance-optimizing indexes on the completed and createdAt fields to improve query speeds for filtering and sorting operations.

## Database Relationships

Currently, the schema consists of a single todos table without relationships to other tables. Future enhancements could include:

- User accounts: Adding a users table and relating todos to specific users
- Categories: Adding a categories table to organize todos by category
- Tags: Implementing a many-to-many relationship between todos and tags

## Design Considerations

The current schema design offers several advantages:

1. **Simplicity**: A single table design makes queries straightforward and efficient for a basic todo application.

2. **Performance**: Indexes on commonly filtered/sorted columns optimize query performance.

3. **Flexibility**: The TEXT type for description allows for detailed task descriptions of any length.

4. **Tracking**: The built-in timestamps enable time-based operations and sorting.
