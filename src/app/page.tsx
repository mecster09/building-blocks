'use client'

import { TaskForm } from '@/components/TaskForm'
import { TaskList } from '@/components/TaskList'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Modal } from '@/components/Modal'
import { BottomNavigation } from '@/components/BottomNavigation'
import { useAppSelector } from '@/store/hooks'
import { useState } from 'react'

type ViewType = 'category' | 'date'

export default function Home() {
  const tasks = useAppSelector(state => state.tasks.tasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [view, setView] = useState<ViewType>('category')
  const [showSidebar, setShowSidebar] = useState(true)

  return (
    <main className="min-h-screen p-4 pb-24 sm:p-8 bg-gray-50 dark:bg-gray-900">
      {/* Desktop Header */}
      <div className="hidden sm:flex items-center justify-between max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tasks
          </h1>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                     p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={showSidebar ? 'Hide Add Task form' : 'Show Add Task form'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showSidebar ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>
        <ThemeToggle />
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className={`sm:grid ${showSidebar ? 'sm:grid-cols-[350px,1fr]' : 'sm:grid-cols-1'} sm:gap-8`}>
          {/* Desktop Sidebar */}
          {showSidebar && (
            <div className="hidden sm:block bg-white/80 dark:bg-gray-800/30 p-6 rounded-2xl backdrop-blur-sm">
              <TaskForm />
            </div>
          )}
          
          {/* Task List */}
          <div className="sm:bg-white/80 sm:dark:bg-gray-800/30 sm:p-6 sm:rounded-2xl sm:backdrop-blur-sm">
            <TaskList tasks={tasks} view={view} onViewChange={setView} />
          </div>
        </div>

        {/* Mobile Navigation */}
        <BottomNavigation 
          currentView={view}
          onViewChange={setView}
          onAddClick={() => setIsModalOpen(true)}
        />

        {/* Mobile Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add New Task
            </h2>
          </div>
          <TaskForm onComplete={() => setIsModalOpen(false)} />
        </Modal>
      </div>
    </main>
  )
}