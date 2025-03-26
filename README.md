# Responsive To-Do List Web Application

A full-stack web application for managing your to-do list with a responsive design that works on all devices.

## Features

- Create, view, update, and delete to-do items
- Mark tasks as completed
- Filter tasks by status (all, active, completed)
- Responsive design that works on desktop, tablet, and mobile devices
- Clean and modern user interface
- MySQL database for persistent storage

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: React, TypeScript, Vite
- **Database**: MySQL
- **Styling**: CSS with responsive design
- **Data Management**: RESTful API

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL Server (v5.7 or higher)

## Project Structure

This is a full-stack application with:
- **Root directory**: Contains the Express.js backend server
- **`client/` directory**: Contains the React/TypeScript frontend

## Installation

### Database Setup

1. Make sure your MySQL server is running
2. The application will automatically create a database named `todolist` if it doesn't exist
3. Default database configuration (can be modified in server.js):
   - Host: localhost
   - User: root
   - Password: (empty by default)
   - Database: todolist

### Backend Setup

1. Clone this repository or download the source code
2. Navigate to the project root directory
3. Install the backend dependencies:

```bash
npm install
```

### Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install the frontend dependencies:

```bash
npm install
```

## Running the Application

### Start the Backend Server

From the root directory:

```bash
npm run dev
```

This will start the Express server in development mode with Nodemon at http://localhost:3000

### Start the Frontend Client

From the client directory:

```bash
cd client
npm run dev
```

This will start the React development server with Vite at http://localhost:5173

## Accessing the Application

After starting both the backend and frontend servers, you can access the application by opening your browser and navigating to:

```
http://localhost:5173
```

## Development

### Backend Development

The backend uses Nodemon for automatic reloading during development.

### Frontend Development

The frontend uses Vite for fast development with hot module replacement (HMR).

To build the frontend for production:

```bash
cd client
npm run build
```

## How to Use

1. **Add a Task**: Enter a title and optional description, then click "Add Task"
2. **Mark as Completed**: Click the checkbox next to a task
3. **Edit a Task**: Click the edit icon, modify the task details, and save
4. **Delete a Task**: Click the delete icon and confirm deletion
5. **Filter Tasks**: Use the filter buttons to view all, active, or completed tasks

## Database Configuration

If you need to change the database configuration, modify the `dbConfig` object in `server.js`:

```javascript
const dbConfig = {
  host: 'localhost',  // Your MySQL host
  user: 'root',       // Your MySQL username
  password: '',       // Your MySQL password
  database: 'todolist' // Your database name
};

```

## Database Migrations

The application uses a simple migration system to manage database schema changes over time. Migrations provide a way to evolve your database schema while preserving existing data.

### Migration Structure

The `migrations` folder contains:
- Migration script files (numbered sequentially like `001-create-todos-table.js`)
- A `migration-runner.js` that manages migration execution
- A database table called `migrations` that tracks which migrations have been applied

### When to Use Migrations

Database migrations should be used in the following scenarios:

1. **Schema Changes**: When you need to modify your database structure (add/modify/remove tables or columns)
2. **Data Migrations**: When you need to transform existing data to match new requirements or fix data inconsistencies
3. **Environment Consistency**: To ensure all development, testing, and production environments have identical database structures
4. **Collaborative Development**: When multiple developers are working on the same codebase and need to share database changes
5. **Versioning**: To keep a historical record of how your database has evolved over time
6. **Deployment Automation**: As part of your CI/CD pipeline to automatically update the database structure during deployments

Using migrations provides a systematic approach to database changes, making them reproducible, reversible, and trackable.

### Running Migrations

To run all pending migrations:

```bash
node migrations/migration-runner.js
```

This will:
1. Initialize the migration system (create the `migrations` table if it doesn't exist)
2. Check which migrations have already been applied
3. Apply any pending migrations in sequential order
4. Record each successful migration in the `migrations` table

### Creating New Migrations

To create a new migration:

1. Create a new JavaScript file in the `migrations` folder with a numbered prefix (e.g., `004-add-due-date.js`)
2. Follow this template structure:

```javascript
async function up(pool) {
  // Code to apply the migration (e.g., CREATE TABLE, ALTER TABLE, etc.)
  await pool.query('ALTER TABLE todos ADD COLUMN due_date DATETIME NULL');
  console.log('Added due_date column to todos table');
}

async function down(pool) {
  // Code to reverse the migration (optional)
  await pool.query('ALTER TABLE todos DROP COLUMN due_date');
  console.log('Removed due_date column from todos table');
}

module.exports = { up, down };
```

3. Run the migration system to apply your new changes

### Best Practices

- Always number migrations sequentially (001, 002, 003...)
- Never modify existing migrations that have been applied to production
- Create new migrations for any schema changes
- Test both up and down migrations thoroughly
- Include descriptive comments explaining what each migration does

The migration system ensures database consistency across different environments and makes it easier to manage schema changes as your application evolves.
