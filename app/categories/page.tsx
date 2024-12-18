'use client';

import { useState, useEffect } from 'react';
import { Task, Category } from '@/types/task';

export default function Categories() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCategories = localStorage.getItem('categories');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
  }, []);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const getTaskCountForCategory = (categoryName: string) => {
    return tasks.filter(task => task.category === categoryName).length;
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    if (getTaskCountForCategory(categoryName) > 0) {
      alert('Cannot delete category that has tasks assigned to it');
      return;
    }
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const handleEditCategory = (categoryId: string, newName: string) => {
    if (newName.trim() === '') return;
    
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, name: newName.trim() } : cat
    ));
    
    // Update all tasks with the old category name
    const oldName = categories.find(cat => cat.id === categoryId)?.name;
    if (oldName) {
      setTasks(tasks.map(task =>
        task.category === oldName ? { ...task, category: newName.trim() } : task
      ));
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Manage Categories</h1>
      
      <div className="space-y-4">
        {categories.map(category => (
          <div
            key={category.id}
            className="p-4 rounded border border-gray-200 dark:border-gray-800 flex items-center justify-between"
          >
            {editingId === category.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => handleEditCategory(category.id, editName)}
                onKeyDown={(e) => e.key === 'Enter' && handleEditCategory(category.id, editName)}
                className="flex-1 p-2 rounded border border-gray-200 dark:border-gray-800 bg-background"
                autoFocus
              />
            ) : (
              <div className="flex-1">
                <span className="font-medium">{category.name}</span>
                <span className="ml-2 text-sm opacity-70">
                  ({getTaskCountForCategory(category.name)} tasks)
                </span>
              </div>
            )}
            
            <div className="flex gap-2">
              {editingId !== category.id && (
                <>
                  <button
                    onClick={() => {
                      setEditingId(category.id);
                      setEditName(category.name);
                    }}
                    className="px-3 py-1 rounded bg-foreground text-background"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="px-3 py-1 rounded bg-red-500 text-white"
                    disabled={getTaskCountForCategory(category.name) > 0}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-center opacity-50">No categories yet. Create one by adding a task!</p>
        )}
      </div>
    </div>
  );
} 