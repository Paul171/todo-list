import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import EditModal from './components/EditModal';
import { Todo } from './types/todo';
import API_URL from './config/api';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos from API
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/todos`);
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading todos. Please try again later.');
        setLoading(false);
        console.error('Error fetching todos:', err);
      }
    };

    fetchTodos();
  }, []);

  // Filter todos when todos or filter changes
  useEffect(() => {
    filterTodos();
  }, [todos, filter]);

  const filterTodos = () => {
    switch (filter) {
      case 'active':
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case 'completed':
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      default:
        setFilteredTodos(todos);
    }
  };

  // Add new todo
  const addTodo = async (title: string, description: string) => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add task');
      }

      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add task. Please try again.');
      }
      console.error('Error adding todo:', err);
    }
  };

  // Toggle todo completed status
  const toggleTodoStatus = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }

      const updatedTodo = await response.json();
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update task status. Please try again.');
      }
      console.error('Error updating todo status:', err);
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete task. Please try again.');
      }
      console.error('Error deleting todo:', err);
    }
  };

  // Open edit modal
  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  // Update todo
  const updateTodo = async (id: string, title: string, description: string, completed: boolean) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, completed }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }

      const updatedTodo = await response.json();
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
      closeEditModal();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update task. Please try again.');
      }
      console.error('Error updating todo:', err);
    }
  };

  // Clear error message
  const clearError = () => {
    setError(null);
  };

  return (
    <div className="container">
      <header>
        <h1>Todo List</h1>
      </header>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={clearError}>×</button>
        </div>
      )}

      <TodoForm onAddTodo={addTodo} />

      <div className="todo-list-section">
        <div className="todo-header">
          <h2>My Tasks</h2>
          <div className="filter">
            <label htmlFor="filter">Filter: </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onToggleTodoStatus={toggleTodoStatus}
            onDeleteTodo={deleteTodo}
            onEditTodo={openEditModal}
          />
        )}
      </div>

      {editingTodo && (
        <EditModal
          todo={editingTodo}
          isOpen={isModalOpen}
          onClose={closeEditModal}
          onUpdateTodo={updateTodo}
        />
      )}
    </div>
  );
}

export default App;
