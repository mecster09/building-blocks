'use client'

import { Task } from '@/types/task'
import styles from '@/styles/ios.module.css'
import { useState, useMemo, useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { deleteTask, updateTask } from '@/store/taskSlice'
import dynamic from 'next/dynamic'
import type { DraggableProvided, DroppableProvided, DropResult, DraggableLocation } from 'react-beautiful-dnd'
import { db } from '@/store/database'
import { ViewToggle } from '@/components/ViewToggle'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

// Dynamically import DnD components with SSR disabled
const DragDropContext = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.DragDropContext),
  { ssr: false }
)
const Droppable = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.Droppable),
  { ssr: false }
)
const Draggable = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.Draggable),
  { ssr: false }
)

type TaskListProps = {
  tasks: Task[]
  view: ViewType
  onViewChange: (view: ViewType) => void
}

type GroupedTasks = {
  [key: string]: Task[]
}

type SortOrder = 'custom' | 'asc' | 'desc'
type ViewType = 'category' | 'date'

type DragResult = {
  draggableId: string;
  type: string;
  source: {
    index: number;
    droppableId: string;
  };
  destination?: {
    index: number;
    droppableId: string;
  };
}

export function TaskList({ tasks, view, onViewChange }: TaskListProps) {
  const dispatch = useAppDispatch()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('custom')
  const [categoryOrder, setCategoryOrder] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0)
  const [showNoDate, setShowNoDate] = useState(true)
  const [{ x }, api] = useSpring(() => ({ x: 0 }))

  const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
    if (active && Math.abs(mx) > window.innerWidth * 0.3) {
      const newIndex = xDir > 0 ? currentTimelineIndex - 1 : currentTimelineIndex + 1
      if (newIndex >= 0 && newIndex < timelineOrder.length) {
        setCurrentTimelineIndex(newIndex)
        cancel()
      }
    }
    api.start({ x: active ? mx : 0, immediate: active })
  }, {
    axis: 'x',
    bounds: { left: -window.innerWidth, right: window.innerWidth },
    rubberband: true
  })

  // Load saved category order
  useEffect(() => {
    const loadCategoryOrder = async () => {
      const savedOrder = await db.getCategoryOrder()
      if (savedOrder.length > 0) {
        setCategoryOrder(savedOrder)
      }
    }
    loadCategoryOrder()
  }, [])

  // Save category order when it changes
  useEffect(() => {
    if (mounted && categoryOrder.length > 0) {
      db.updateCategoryOrder(categoryOrder)
    }
  }, [categoryOrder, mounted])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Function to check if a date is this week (Monday to Sunday)
  const isThisWeek = (date: Date) => {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1) // Get Monday
    monday.setHours(0, 0, 0, 0)
    
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6) // Get Sunday
    sunday.setHours(23, 59, 59, 999)
    
    return date >= monday && date <= sunday
  }

  // Define the order for timeline sections
  const timelineOrder = ['Today', 'This Week', 'Future', 'No Date']

  // Group tasks by due date with ordered sections
  const dateGroupedTasks = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Initialize all sections to ensure consistent order
    const groups: { [key: string]: Task[] } = {
      'Today': [],
      'This Week': [],
      'Future': [],
      'No Date': []
    }

    tasks.forEach(task => {
      if (!task.dueDate) {
        groups['No Date'].push(task)
        return
      }

      const dueDate = new Date(task.dueDate)
      
      if (dueDate <= today) {
        groups['Today'].push(task)
      } else if (isThisWeek(dueDate)) {
        groups['This Week'].push(task)
      } else {
        groups['Future'].push(task)
      }
    })

    return groups
  }, [tasks])

  // Group tasks by category
  const groupedTasks = useMemo(() => {
    return tasks.reduce((groups: GroupedTasks, task) => {
      const category = task.category || 'Uncategorized'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(task)
      return groups
    }, {})
  }, [tasks])

  // Get sorted categories
  const sortedCategories = useMemo(() => {
    const categories = Object.keys(groupedTasks)
    
    switch (sortOrder) {
      case 'asc':
        return categories.sort()
      case 'desc':
        return categories.sort().reverse()
      case 'custom':
        return categoryOrder.length ? 
          categoryOrder.filter(cat => categories.includes(cat))
            .concat(categories.filter(cat => !categoryOrder.includes(cat))) 
          : categories
      default:
        return categories
    }
  }, [groupedTasks, sortOrder, categoryOrder])

  const handleDragEnd = (result: DropResult) => {
    const destination = result.destination as DraggableLocation | undefined
    if (!destination) return

    // Handle category reordering
    if (result.type === 'category') {
      const items = Array.from(sortedCategories)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(destination.index, 0, reorderedItem)
      setCategoryOrder(items)
      setSortOrder('custom')
      return
    }

    // Handle task moving between categories
    if (result.type === 'task') {
      const sourceCategory = result.source.droppableId
      const destinationCategory = destination.droppableId
      
      if (sourceCategory !== destinationCategory) {
        const taskId = parseInt(result.draggableId)
        const task = tasks.find(t => t.id === taskId)
        
        if (task) {
          const updates: Partial<Task> = {
            category: destinationCategory === 'Uncategorized' ? undefined : destinationCategory
          }
          dispatch(updateTask({ id: taskId, updates }))
        }
      }
    }
  }

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

  const isOverdue = (dueDate: string | undefined) => {
    if (!dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(dueDate) < today
  }

  const getTaskItemClasses = (task: Task) => {
    const baseClasses = `${styles.taskItem} p-4 group transition-all`
    const regularClasses = 'bg-white/80 dark:bg-gray-800/30'
    
    return `${baseClasses} ${regularClasses}`
  }

  const renderTimelineView = () => {
    const visibleTimeframe = timelineOrder[currentTimelineIndex]
    
    // Separate No Date from other timeframes
    const mainTimeframes = timelineOrder.filter(t => t !== 'No Date')
    
    return (
      <div className="flex flex-col h-[calc(100vh-16rem)]">
        {/* Mobile Timeline Navigation */}
        <div className="sm:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentTimelineIndex(prev => Math.max(0, prev - 1))}
            disabled={currentTimelineIndex === 0}
            className="p-2 text-gray-500 disabled:opacity-30"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {visibleTimeframe}
          </h2>
          <button
            onClick={() => setCurrentTimelineIndex(prev => Math.min(timelineOrder.length - 1, prev + 1))}
            disabled={currentTimelineIndex === timelineOrder.length - 1}
            className="p-2 text-gray-500 disabled:opacity-30"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Desktop Grid / Mobile Swipe View */}
        <div className="relative flex-1 overflow-hidden">
          <animated.div
            {...bind()}
            style={{ x, touchAction: 'none' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-full"
          >
            {/* Main timeframe columns */}
            {mainTimeframes.map((timeframe, index) => (
              <div 
                key={timeframe} 
                className={`space-y-4 ${
                  index !== currentTimelineIndex ? 'hidden sm:block' : ''
                }`}
              >
                <div className="sticky top-0 z-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm py-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {timeframe}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      ({dateGroupedTasks[timeframe]?.length || 0})
                    </span>
                  </h2>
                </div>

                <div className="space-y-4">
                  {dateGroupedTasks[timeframe]?.length > 0 ? (
                    dateGroupedTasks[timeframe]
                      .sort((a, b) => {
                        if (!a.dueDate || !b.dueDate) return 0
                        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                      })
                      .map(task => (
                        <div key={task.id} className={getTaskItemClasses(task)}>
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
                                <>
                                  <h3 
                                    className="font-medium truncate text-gray-900 dark:text-gray-100"
                                    onClick={() => handleEdit(task)}
                                  >
                                    {task.task}
                                  </h3>
                                  {task.category && (
                                    <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs 
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
                                </>
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
                      ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No tasks in this timeframe
                    </div>
                  )}
                </div>
              </div>
            ))}
          </animated.div>
        </div>

        {/* No Date Section - Full Width on Desktop */}
        <div className="hidden sm:block mt-6">
          <div className="bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
            <button
              onClick={() => setShowNoDate(!showNoDate)}
              className="w-full px-4 py-2 flex items-center justify-between text-left"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                No Date
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({dateGroupedTasks['No Date']?.length || 0})
                </span>
              </h2>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${showNoDate ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showNoDate && dateGroupedTasks['No Date']?.length > 0 && (
              <div className="p-4 grid grid-cols-1 gap-4">
                {dateGroupedTasks['No Date'].map(task => (
                  <div key={task.id} className={getTaskItemClasses(task)}>
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
                          <>
                            <h3 
                              className="font-medium truncate text-gray-900 dark:text-gray-100"
                              onClick={() => handleEdit(task)}
                            >
                              {task.task}
                            </h3>
                            {task.category && (
                              <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs 
                                bg-blue-100/80 dark:bg-blue-900/50 
                                text-blue-800 dark:text-blue-200">
                                {task.category}
                              </div>
                            )}
                          </>
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
            )}
          </div>
        </div>

        {/* Mobile Progress Indicators */}
        <div className="sm:hidden flex justify-center gap-2 py-4 mt-auto">
          {timelineOrder.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentTimelineIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  if (!mounted) return null

  if (tasks.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
        No tasks yet. Add one above!
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Show ViewToggle only on desktop */}
      <div className="mb-6 space-y-4 hidden sm:block">
        <ViewToggle currentView={view} onViewChange={onViewChange} />
        
        {view === 'category' && (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Categories
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSortOrder('asc')}
                className={`px-3 py-1 rounded-md text-sm ${
                  sortOrder === 'asc' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                A-Z
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                className={`px-3 py-1 rounded-md text-sm ${
                  sortOrder === 'desc' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                Z-A
              </button>
            </div>
          </div>
        )}
      </div>

      {view === 'category' ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories" type="category" direction="vertical">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-8"
              >
                {sortedCategories.map((category, index) => (
                  <Draggable 
                    key={category} 
                    draggableId={category} 
                    index={index}
                    isDragDisabled={sortOrder !== 'custom'}
                  >
                    {(provided: DraggableProvided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`mb-6 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                      >
                        <div className="space-y-4">
                          <div 
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-2 px-1 
                                      ${sortOrder === 'custom' ? 'cursor-grab active:cursor-grabbing' : ''}
                                      ${snapshot.isDragging ? 'bg-gray-100 dark:bg-gray-800 rounded-lg' : ''}`}
                          >
                            {sortOrder === 'custom' && (
                              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                              </svg>
                            )}
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex-grow">
                              {category}
                              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                                ({groupedTasks[category].length})
                              </span>
                            </h2>
                          </div>

                          <Droppable droppableId={category} type="task">
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`space-y-4 ${
                                  snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-2' : ''
                                }`}
                              >
                                {groupedTasks[category].map((task, taskIndex) => (
                                  <Draggable
                                    key={task.id}
                                    draggableId={task.id.toString()}
                                    index={taskIndex}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`${getTaskItemClasses(task)} ${
                                          snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500/20' : ''
                                        }`}
                                      >
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
                                                className="font-medium truncate text-gray-900 dark:text-gray-100"
                                                onClick={() => handleEdit(task)}
                                              >
                                                {task.task}
                                              </h3>
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
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : renderTimelineView()}
    </div>
  )
}