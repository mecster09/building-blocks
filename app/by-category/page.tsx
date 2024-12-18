'use client';

import { useState, useEffect } from 'react';
import { Task, Category } from '@/types/task';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Copy the EditingTask interface and TaskItem component from app/page.tsx
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
        <td colSpan={4} className="p-2">
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

// Add the SortableCategory component
function SortableCategory({ category, tasks, onToggleTask, onEditTask, onDeleteTask, formatDate, isCustomSort }: {
  category: string;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: EditingTask) => void;
  onDeleteTask: (id: string) => void;
  formatDate: (date: string | null) => string;
  isCustomSort: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: category });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Sort tasks alphabetically within category
  const sortedTasks = [...tasks].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div ref={setNodeRef} style={style} className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        {isCustomSort && category !== 'Uncategorized' && (
          <div {...attributes} {...listeners} className="cursor-move">⋮⋮</div>
        )}
        <h3 className="text-xl font-semibold">{category}</h3>
        <span className="text-sm text-gray-500">({tasks.length})</span>
      </div>
      <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="w-12 p-3"></th>
              <th className="p-3 text-left">Task</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="w-20 p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {sortedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleTask={onToggleTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                formatDate={formatDate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ByCategory() {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    category: '',
    dueDate: '',
  });
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'custom' | 'alphabetical'>('custom');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Load and save data
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

  // Category filtering
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

  // Task handlers
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTask.category.trim() && !categories.some(cat => 
      cat.name.toLowerCase() === newTask.category.toLowerCase()
    )) {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name: newTask.category.trim(),
      };
      setCategories([...categories, newCategory]);
    }

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      category: newTask.category.trim() || 'Uncategorized',
      dueDate: newTask.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', category: '', dueDate: '' });
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
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

  // Drag and drop handlers
  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
    
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!active || !over || active.id === over.id) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    if (!activeTask) {
      const oldIndex = categoryOrder.indexOf(active.id);
      const newIndex = categoryOrder.indexOf(over.id);
      
      if (oldIndex === -1 || newIndex === -1) {
        const currentOrder = getSortedCategories();
        const updatedOrder = arrayMove(
          currentOrder,
          currentOrder.indexOf(active.id),
          currentOrder.indexOf(over.id)
        );
        setCategoryOrder(updatedOrder);
      } else {
        setCategoryOrder(arrayMove(categoryOrder, oldIndex, newIndex));
      }
    }
  };

  // Formatting and sorting
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSortedCategories = () => {
    let cats = Object.keys(groupedTasks);
    
    if (sortOrder === 'alphabetical') {
      cats.sort((a, b) => {
        if (a === 'Uncategorized') return 1;
        if (b === 'Uncategorized') return -1;
        return a.localeCompare(b);
      });
    } else {
      if (categoryOrder.length === 0) {
        cats.sort((a, b) => {
          if (a === 'Uncategorized') return 1;
          if (b === 'Uncategorized') return -1;
          return a.localeCompare(b);
        });
      } else {
        cats = categoryOrder.filter(cat => cats.includes(cat));
        const remainingCats = cats.filter(cat => !categoryOrder.includes(cat));
        cats.push(...remainingCats);
      }
    }
    
    if (cats.includes('Uncategorized')) {
      cats = cats.filter(c => c !== 'Uncategorized');
      cats.push('Uncategorized');
    }
    
    return cats;
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Add Task Form */}
      <div className="mb-8">
        {/* ... copy the form JSX from Home component ... */}
      </div>

      {/* Tasks by Category */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tasks by Category</h2>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'custom' | 'alphabetical')}
            className="p-2 rounded border border-gray-200 dark:border-gray-800 bg-background"
          >
            <option value="custom">Custom Order</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={getSortedCategories()}
            strategy={verticalListSortingStrategy}
            disabled={sortOrder === 'alphabetical'}
          >
            {getSortedCategories().map((category) => (
              <SortableCategory
                key={category}
                category={category}
                tasks={groupedTasks[category] || []}
                onToggleTask={toggleTaskComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                formatDate={formatDate}
                isCustomSort={sortOrder === 'custom'}
              />
            ))}
          </SortableContext>
        </DndContext>

        {tasks.length === 0 && (
          <p className="text-center opacity-50">No tasks yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}