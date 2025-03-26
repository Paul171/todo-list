import { useState, FormEvent, useEffect } from 'react';
import { Todo } from '../types/todo';

interface EditModalProps {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTodo: (id: string, title: string, description: string, completed: boolean) => void;
}

const EditModal: React.FC<EditModalProps> = ({ todo, isOpen, onClose, onUpdateTodo }) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [completed, setCompleted] = useState(todo.completed);

  // Update form state when todo changes
  useEffect(() => {
    setTitle(todo.title);
    setDescription(todo.description);
    setCompleted(todo.completed);
  }, [todo]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onUpdateTodo(todo.id, title, description, completed);
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-title">Title</label>
            <input
              type="text"
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
              />
              Mark as completed
            </label>
          </div>
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
