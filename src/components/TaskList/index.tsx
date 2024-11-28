'use client'

import { Task } from '@/types/task'
import styles from '@/styles/ios.module.css'
import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { deleteTask, updateTask } from '@/store/taskSlice'

type TaskListProps = {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  const dispatch = useAppDispatch()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  const handleEdit = (task: Task) => {
    setEditingId(task.id)
    setEditText(task.task)
  }

  const handleSave = (id: number) => {
    if (editText.trim()) {
      dispatch(updateTask({ id, updates: { task: editText } }))
      setEditingId(null)
    }
  }

  const handleDelete = (id: number) => {
    dispatch(deleteTask(id))
  }

  if (tasks.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
        No tasks yet. Add one above!
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-4 w-full max-w-md mx-auto">
      {tasks.map(task => (
        <div key={task.id} className={`${styles.taskItem} bg-white/80 dark:bg-gray-800/30 p-4 group`}>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              {editingId === task.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => handleSave(task.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave(task.id)}
                  className={`${styles.iosInput} bg-white/50 dark:bg-gray-700/50 
                             text-gray-900 dark:text-gray-100 
                             border-gray-200/50 dark:border-gray-600/30
                             focus:ring-blue-500/20 dark:focus:ring-blue-500/30`}
                  autoFocus
                />
              ) : (
                <h3 
                  className="font-medium text-gray-900 dark:text-gray-100 truncate"
                  onClick={() => handleEdit(task)}
                >
                  {task.task}
                </h3>
              )}
              {task.category && (
                <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                              bg-blue-100/80 dark:bg-blue-900/50 
                              text-blue-800 dark:text-blue-200">
                  {task.category}
                </div>
              )}
              {task.dueDate && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDelete(task.id)}
              className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400
                         p-2 -m-2 rounded-full transition-colors"
              aria-label="Delete task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}