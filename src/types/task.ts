export interface Task {
    id: number
    task: string
    completed: boolean
    category?: string
    priority: 'low' | 'medium' | 'high'
    createdAt: string
    dueDate?: string
  }
  
  export interface ValidationErrors {
    task?: string
    category?: string
    dueDate?: string
  }