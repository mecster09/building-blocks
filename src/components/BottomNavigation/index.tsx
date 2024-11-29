'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

type ViewType = 'category' | 'date'

interface BottomNavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  onAddClick: () => void
}

export function BottomNavigation({ currentView, onViewChange, onAddClick }: BottomNavigationProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 sm:hidden border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="flex items-center justify-between h-16 px-4 max-w-md mx-auto">
        {/* Menu Button and Dropdown */}
        <div className="relative flex flex-col items-center p-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-600 
                         flex items-center justify-center -mt-8 mb-1 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">Menu</span>
          </button>

          {/* Menu Dropdown */}
          {showMenu && (
            <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[120px]">
              <button
                onClick={() => {
                  toggleTheme()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                          text-gray-900 dark:text-gray-100 transition-colors"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => onViewChange('category')}
          className={`flex flex-col items-center p-2 ${
            currentView === 'category' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-xs mt-1">Categories</span>
        </button>

        <button
          onClick={() => onViewChange('date')}
          className={`flex flex-col items-center p-2 ${
            currentView === 'date' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs mt-1">Timeline</span>
        </button>

        <button
          onClick={onAddClick}
          className="flex flex-col items-center p-2 text-blue-500"
        >
          <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full 
                       flex items-center justify-center -mt-8 mb-1
                       shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 
                       active:transform active:scale-95 transition-all">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-xs mt-1">New Task</span>
        </button>
      </div>
    </div>
  )
} 