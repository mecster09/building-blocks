'use client';

import { useState, useEffect } from 'react';
import { Task, Category } from '@/types/task';

interface EditingTask {
  id: string;
  title: string;
  category: string;
  dueDate: string | null;
}

function TaskItem({ task, onToggleTask, onEditTask, onDeleteTask, formatDate }: {
  task: Task;
  onToggleTask: (id: string) => void;
  onEditTask: (task: EditingTask) => void;
  onDeleteTask: (id: string) => void;
  formatDate: (date: string | null) => string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditingTask>({
    id: task.id,
    title: task.title,
    category: task.category,
    dueDate: task.dueDate,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditTask(editForm);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr>
        <td colSpan={5} className="p-2">
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full p-2 rounded border border-gray-200 dark:border-gray-800 bg-background"
              required
            />
            <input
              type="text"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              className="w-full p-2 rounded border border-gray-200 dark:border-gray-800 bg-background"
              placeholder="Category (optional)"
            />
            <input
              type="date"
              value={editForm.dueDate || ''}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value || null })}
              className="w-full p-2 rounded border border-gray-200 dark:border-gray-800 bg-background"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1 rounded bg-foreground text-background"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 rounded border border-gray-200 dark:border-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-200 dark:border-gray-800">
      <td className="p-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
          className="h-4 w-4"
        />
      </td>
      <td className="p-3">
        <span className={task.completed ? 'line-through opacity-50' : ''}>
          {task.title}
        </span>
      </td>
      <td className="p-3 text-sm opacity-70">
        {task.category}
      </td>
      <td className="p-3 text-sm opacity-70 whitespace-nowrap">
        {formatDate(task.dueDate)}
      </td>
      <td className="p-3">
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDeleteTask(task.id)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCategories = localStorage.getItem('categories');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditTask = (editedTask: EditingTask) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === editedTask.id
        ? {
            ...task,
            title: editedTask.title,
            category: editedTask.category.trim() || 'Uncategorized',
            dueDate: editedTask.dueDate,
          }
        : task
    ));

    if (editedTask.category.trim() && !categories.some(cat => 
      cat.name.toLowerCase() === editedTask.category.toLowerCase()
    )) {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name: editedTask.category.trim(),
      };
      setCategories(prevCategories => [...prevCategories, newCategory]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
  };

  // Sort tasks by title
  const sortedTasks = [...tasks].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold mb-6">Tasks</h2>
        <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-800">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="w-12 p-3"></th>
                <th className="p-3 text-left">Task</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Due Date</th>
                <th className="w-20 p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {sortedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleTask={toggleTaskComplete}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  formatDate={formatDate}
                />
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center opacity-50">
                    No tasks yet. Add one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
