const todoModel = require('../models/todoModel');

class TodoController {
  // Get all todos
  async getAllTodos(req, res) {
    try {
      const todos = await todoModel.getAllTodos();
      res.json(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  }

  // Create a new todo
  async createTodo(req, res) {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    try {
      const newTodo = await todoModel.createTodo({ title, description });
      res.status(201).json(newTodo);
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(500).json({ error: 'Failed to create todo' });
    }
  }

  // Update a todo
  async updateTodo(req, res) {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    try {
      const updatedTodo = await todoModel.updateTodo(id, { title, description, completed });
      
      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      res.json(updatedTodo);
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).json({ error: 'Failed to update todo' });
    }
  }

  // Delete a todo
  async deleteTodo(req, res) {
    const { id } = req.params;
    
    try {
      const deletedTodo = await todoModel.deleteTodo(id);
      
      if (!deletedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      res.json(deletedTodo);
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  }

  // Get a todo by ID
  async getTodoById(req, res) {
    const { id } = req.params;
    
    try {
      const todo = await todoModel.getTodoById(id);
      
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      res.json(todo);
    } catch (error) {
      console.error('Error fetching todo:', error);
      res.status(500).json({ error: 'Failed to fetch todo' });
    }
  }
}

module.exports = new TodoController();
