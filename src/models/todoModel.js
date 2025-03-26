const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/db');

class TodoModel {
  // Get all todos
  async getAllTodos() {
    try {
      const [rows] = await pool.query('SELECT * FROM todos ORDER BY createdAt DESC');
      return rows;
    } catch (error) {
      console.error('Error in getAllTodos:', error);
      throw error;
    }
  }

  // Create a new todo
  async createTodo(todoData) {
    const { title, description = '' } = todoData;
    const id = uuidv4();
    const completed = false;

    try {
      const query = 'INSERT INTO todos (id, title, description, completed, createdAt) VALUES (?, ?, ?, ?, NOW())';
      await pool.query(query, [id, title, description, completed]);
      
      // Fetch the newly created todo to get the correct timestamp
      const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error in createTodo:', error);
      throw error;
    }
  }

  // Get a todo by ID
  async getTodoById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error in getTodoById:', error);
      throw error;
    }
  }

  // Update a todo
  async updateTodo(id, todoData) {
    try {
      // Get the existing todo
      const todo = await this.getTodoById(id);
      if (!todo) {
        return null;
      }
      
      // Update only the fields that were provided
      const { title, description, completed } = todoData;
      const updatedTodo = {
        title: title !== undefined ? title : todo.title,
        description: description !== undefined ? description : todo.description,
        completed: completed !== undefined ? completed : todo.completed
      };
      
      const query = 'UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ?';
      await pool.query(query, [updatedTodo.title, updatedTodo.description, updatedTodo.completed, id]);
      
      // Get the updated todo
      return await this.getTodoById(id);
    } catch (error) {
      console.error('Error in updateTodo:', error);
      throw error;
    }
  }

  // Delete a todo
  async deleteTodo(id) {
    try {
      // Get the todo before deleting
      const todo = await this.getTodoById(id);
      if (!todo) {
        return null;
      }
      
      // Delete the todo
      await pool.query('DELETE FROM todos WHERE id = ?', [id]);
      
      return todo;
    } catch (error) {
      console.error('Error in deleteTodo:', error);
      throw error;
    }
  }
}

module.exports = new TodoModel();
