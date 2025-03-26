const express = require('express');
const todoController = require('../controllers/todoController');

const router = express.Router();

// GET all todos
router.get('/', todoController.getAllTodos.bind(todoController));

// GET a single todo
router.get('/:id', todoController.getTodoById.bind(todoController));

// POST a new todo
router.post('/', todoController.createTodo.bind(todoController));

// PUT (update) a todo
router.put('/:id', todoController.updateTodo.bind(todoController));

// DELETE a todo
router.delete('/:id', todoController.deleteTodo.bind(todoController));

module.exports = router;
