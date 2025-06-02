import React, { useState, useEffect } from 'react';
import { Todo } from './types/Todo';
import TodoList from './components/TodoList';

const LOCAL_STORAGE_KEY = 'todoList';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
  if (!text.trim()) return;
  const newTodo: Todo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    dueDate,
    priority
  };
  setTodos([...todos, newTodo]);
  setText('');
  setDueDate('');
  setPriority('medium');
};

  const handleToggle = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleEdit = (id: number, newText: string) => {
  setTodos(todos.map(todo => 
    todo.id === id ? { ...todo, text: newText } : todo
  ));
};

  const handleDelete = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Task" />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button onClick={handleAddTodo}>Add</button>
      <TodoList
        todos={todos}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default App;
