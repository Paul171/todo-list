const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'todolist'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

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

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// API Routes
// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM todos ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const newTodo = {
    id: uuidv4(),
    title,
    description: description || '',
    completed: false
  };
  
  try {
    const query = 'INSERT INTO todos (id, title, description, completed, createdAt) VALUES (?, ?, ?, ?, NOW())';
    await pool.query(query, [newTodo.id, newTodo.title, newTodo.description, newTodo.completed]);
    
    // Fetch the newly created todo to get the correct timestamp
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [newTodo.id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  
  try {
    // Check if todo exists
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const todo = rows[0];
    
    // Update only the fields that were provided
    const updatedTodo = {
      title: title !== undefined ? title : todo.title,
      description: description !== undefined ? description : todo.description,
      completed: completed !== undefined ? completed : todo.completed
    };
    
    const query = 'UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ?';
    await pool.query(query, [updatedTodo.title, updatedTodo.description, updatedTodo.completed, id]);
    
    // Get the updated todo
    const [updatedRows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    res.json(updatedRows[0]);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if todo exists
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const deletedTodo = rows[0];
    
    // Delete the todo
    await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    
    res.json(deletedTodo);
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Serve React app for any other route (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Initialize database before starting the server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
