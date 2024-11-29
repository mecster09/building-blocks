'use client'

type ViewType = 'category' | 'date'

type ViewToggleProps = {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={() => onViewChange('category')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          currentView === 'category'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        Categories
      </button>
      <button
        onClick={() => onViewChange('date')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          currentView === 'date'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        Timeline
      </button>
    </div>
  )
} 