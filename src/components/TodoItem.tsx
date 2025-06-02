import React, { useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-400';
    case 'high':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  return (
    <div className="flex items-center justify-between gap-2 py-2 px-3 rounded-md bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <span
          className={`w-3 h-3 rounded-full ${getPriorityColor(todo.priority ?? 'low')}`}
          title={`Priority: ${todo.priority}`}
        ></span>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 accent-blue-500 dark:accent-blue-400 bg-white border-gray-300 dark:border-gray-600"
        />
        {isEditing ? (
          <input
            className="border border-gray-300 dark:border-gray-600  rounded px-2 py-1 text-sm w-full bg-white text-gray-900 dark:text-gray-100 transition-colors"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
        ) : (
          <span
            className={`text-sm transition-colors ${
              todo.completed
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-800 dark:text-gray-700'
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <button
            onClick={() => {
              onEdit(todo.id, newText);
              setIsEditing(false);
            }}
            className="text-green-600 hover:underline text-sm"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:underline text-sm"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="text-red-500 hover:underline text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
