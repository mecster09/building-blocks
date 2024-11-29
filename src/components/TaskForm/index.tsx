'use client'

import { useState, useMemo } from 'react'
import { Task, ValidationErrors } from '@/types/task'
import { validateTask } from './validation'
import styles from '@/styles/ios.module.css'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addTask } from '@/store/taskSlice'

type TaskFormProps = {
  onComplete?: () => void
}

export function TaskForm({ onComplete }: TaskFormProps) {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(state => state.tasks.tasks)
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'completed' | 'priority' | 'createdAt'>>({
    task: '',
    category: '',
    dueDate: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false)

  // Get unique categories and sort them alphabetically
  const existingCategories = useMemo(() => {
    const categories = new Set(tasks.map(task => task.category).filter(Boolean))
    return Array.from(categories).sort()
  }, [tasks])

  const handleCategorySelect = (category: string) => {
    setNewTask(prev => ({ ...prev, category }))
    setShowCategorySuggestions(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateTask(newTask.task, newTask.category, newTask.dueDate || undefined)
    
    if (Object.keys(validationErrors).length === 0) {
      dispatch(addTask(newTask))
      setNewTask({ task: '', category: '', dueDate: '' })
      setErrors({})
      onComplete?.()
    } else {
      setErrors(validationErrors)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      <div className={`${styles.iosCard} bg-white/80 dark:bg-gray-800/30`}>
        <div className="p-4 space-y-4">
          <input
            type="text"
            value={newTask.task}
            onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
            placeholder="What needs to be done?"
            className={`${styles.iosInput} bg-white/50 dark:bg-gray-700/50 
                       text-gray-900 dark:text-gray-100 
                       placeholder:text-gray-500 dark:placeholder:text-gray-400
                       border-gray-200/50 dark:border-gray-600/30
                       focus:ring-blue-500/20 dark:focus:ring-blue-500/30`}
          />
          {errors.task && (
            <p className="text-red-500 dark:text-red-400 text-sm px-1">{errors.task}</p>
          )}

          <div className="relative">
            <input
              type="text"
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              onFocus={() => setShowCategorySuggestions(true)}
              placeholder="Category (optional)"
              className={`${styles.iosInput} bg-white/50 dark:bg-gray-700/50 
                         text-gray-900 dark:text-gray-100 
                         placeholder:text-gray-500 dark:placeholder:text-gray-400
                         border-gray-200/50 dark:border-gray-600/30
                         focus:ring-blue-500/20 dark:focus:ring-blue-500/30`}
            />
            
            {/* Category suggestions dropdown */}
            {showCategorySuggestions && existingCategories.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-600/30 max-h-48 overflow-y-auto">
                {existingCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700
                             text-gray-900 dark:text-gray-100 first:rounded-t-lg last:rounded-b-lg
                             transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="date"
              value={newTask.dueDate || ''}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className={`${styles.iosInput} bg-white/50 dark:bg-gray-700/50 
                         text-gray-900 dark:text-gray-100
                         border-gray-200/50 dark:border-gray-600/30
                         focus:ring-blue-500/20 dark:focus:ring-blue-500/30`}
            />
            {errors.dueDate && (
              <p className="text-red-500 dark:text-red-400 text-sm px-1">{errors.dueDate}</p>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200/30 dark:border-gray-600/30">
          <button 
            type="submit" 
            className={`${styles.iosButton} bg-blue-500 dark:bg-blue-600 
                       hover:bg-blue-600 dark:hover:bg-blue-700 
                       active:bg-blue-700 dark:active:bg-blue-800`}
          >
            Add Task
          </button>
        </div>
      </div>
    </form>
  )
}