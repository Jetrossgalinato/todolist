import React, { useState, useEffect } from 'react';
import { Todo } from './types/Todo';
import TodoList from './components/TodoList';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching todos:', error);
      } else {
        setTodos(data as Todo[]);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!text.trim()) return;

    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          text: text.trim(),
          completed: false,
          due_date: dueDate || null,
          priority,
        },
      ])
      .select();

    if (error) {
      console.error('Error adding todo:', error);
    } else if (data) {
      setTodos([...todos, ...data]);
      setText('');
      setDueDate('');
      setPriority('medium');
    }
  };

  const handleToggle = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', id);

    if (!error) {
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    }
  };

  const handleEdit = async (id: string, newText: string) => {
    const { error } = await supabase
      .from('todos')
      .update({ text: newText })
      .eq('id', id);

    if (!error) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: newText } : todo
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (!error) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-4">📝 To-Do List</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="mb-2">
          {darkMode ? (
            // Sun icon for light mode
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
              <path stroke="currentColor" strokeWidth="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke="currentColor" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
            </svg>
          )}
        </button>
        
        <div className="flex flex-col gap-4 mb-6 mt-4">
          <input
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a task..."
          />
          <input
            className="px-4 py-2 border rounded-md text-gray-600 dark:text-gray-200 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-700"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-700"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <button
            onClick={handleAddTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Add Task
          </button>
        </div>

        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default App;
