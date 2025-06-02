export interface Todo {
  id: string; // UUID from Supabase
  text: string;
  completed: boolean;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
}
