import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Todo } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  onToggleTodoStatus: (id: string, completed: boolean) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (todo: Todo) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleTodoStatus,
  onDeleteTodo,
  onEditTodo,
}) => {
  // Format date string
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  if (todos.length === 0) {
    return (
      <div className="todo-list">
        <div className="empty-list-message">
          <p>No tasks found. Add a new task above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`todo-item ${todo.completed ? 'completed' : ''}`}
        >
          <div className="todo-checkbox">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => onToggleTodoStatus(todo.id, e.target.checked)}
            />
          </div>
          <div className="todo-content">
            <div className="todo-title">{todo.title}</div>
            {todo.description && (
              <div className="todo-description">{todo.description}</div>
            )}
            <div className="todo-date">Created: {formatDate(todo.createdAt)}</div>
          </div>
          <div className="todo-actions">
            <button
              className="edit-btn"
              title="Edit"
              onClick={() => onEditTodo(todo)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="delete-btn"
              title="Delete"
              onClick={() => onDeleteTodo(todo.id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
