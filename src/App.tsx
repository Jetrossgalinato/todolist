import React, { useState, useEffect } from 'react';
import { Todo } from './types/Todo';
import TodoList from './components/TodoList';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">📝 To-Do List</h1>
        
        <div className="flex flex-col gap-4 mb-6">
          <input
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a task..."
          />
          <input
            className="px-4 py-2 border rounded-md text-gray-600"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-md text-gray-700"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <button
            onClick={handleAddTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
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
