import React, { useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 accent-blue-500"
        />
        {isEditing ? (
          <input
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
        ) : (
          <span
            className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
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
