import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Task } from '@/types/task'

interface TaskState {
  tasks: Task[]
}

const initialState: TaskState = {
  tasks: []
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'completed' | 'priority' | 'createdAt'>>) => {
      const newTask: Task = {
        id: Date.now(),
        task: action.payload.task,
        category: action.payload.category,
        dueDate: action.payload.dueDate,
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString()
      }
      state.tasks.push(newTask)
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
    },
    updateTask: (state, action: PayloadAction<{ id: number, updates: Partial<Task> }>) => {
      const { id, updates } = action.payload
      const taskIndex = state.tasks.findIndex(task => task.id === id)
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates }
      }
    },
  },
})

export const { addTask, deleteTask, updateTask } = taskSlice.actions
export default taskSlice.reducer 