import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Task } from '@/types/task'
import { db } from './database'

interface TaskState {
  tasks: Task[]
  isLoading: boolean
}

const initialState: TaskState = {
  tasks: [],
  isLoading: true
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload.map(task => ({
        ...task,
        createdAt: task.createdAt ? task.createdAt.toString() : new Date().toISOString(),
        dueDate: task.dueDate || undefined
      }))
      state.isLoading = false
    },
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'completed' | 'priority' | 'createdAt'>>) => {
      const newTask: Task = {
        id: Date.now(),
        task: action.payload.task,
        category: action.payload.category || undefined,
        dueDate: action.payload.dueDate || undefined,
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString()
      }
      state.tasks.push(newTask)
      db.addTask(JSON.parse(JSON.stringify(newTask)))
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
      db.deleteTasks(JSON.parse(JSON.stringify(state.tasks)))
    },
    updateTask: (state, action: PayloadAction<{ id: number, updates: Partial<Task> }>) => {
      const { id, updates } = action.payload
      const taskIndex = state.tasks.findIndex(task => task.id === id)
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          createdAt: state.tasks[taskIndex].createdAt.toString()
        }
        db.updateTasks(JSON.parse(JSON.stringify(state.tasks)))
      }
    },
  },
})

export const { setTasks, addTask, deleteTask, updateTask } = taskSlice.actions
export default taskSlice.reducer 