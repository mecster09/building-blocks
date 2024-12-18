'use client';

import { useState, useEffect } from 'react';
import { Task, Category } from '@/types/task';

export default function AddTaskButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    category: '',
    dueDate: '',
  });
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCategories = localStorage.getItem('categories');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
  }, []);

  useEffect(() => {
    if (newTask.category) {
      setFilteredCategories(
        categories.filter(cat => 
          cat.name.toLowerCase().includes(newTask.category.toLowerCase())
        )
      );
    } else {
      setFilteredCategories([]);
    }
  }, [newTask.category, categories]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTask.category.trim() && !categories.some(cat => 
      cat.name.toLowerCase() === newTask.category.toLowerCase()
    )) {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name: newTask.category.trim(),
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    }

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      category: newTask.category.trim() || 'Uncategorized',
      dueDate: newTask.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    setNewTask({ title: '', category: '', dueDate: '' });
    setIsOpen(false);
    window.location.reload(); // Refresh to update all views
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-50 p-4 rounded-full bg-foreground text-background shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Add task"
      >
        ➕
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Task</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:opacity-70"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2 rounded border border-gray-200 dark:border-gray-800 bg-background"
                  required
                />
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Category (optional)"
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="w-full p-2 rounded border border-gray-200 dark:border-gray-800 bg-background"
                />
                {filteredCategories.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-gray-200 dark:border-gray-800 rounded shadow-lg z-10">
                    {filteredCategories.map(category => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setNewTask({ ...newTask, category: category.name });
                          setFilteredCategories([]);
                        }}
                        className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <input
                  type="date"
                  value={newTask.dueDate}
                  min={today}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full p-2 rounded border border-gray-200 dark:border-gray-800 bg-background"
                />
              </div>

              <button
                type="submit"
                className="w-full p-2 rounded bg-foreground text-background"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 