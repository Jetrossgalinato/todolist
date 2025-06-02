import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const TodoList: React.FC<Props> = ({ todos, onToggle, onDelete, onEdit }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">No tasks yet. Add one above!</div>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li key={todo.id} className="bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition">
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
