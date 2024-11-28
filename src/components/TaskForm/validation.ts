import { ValidationErrors } from '@/types/task'

export function validateTask(task: string, category?: string, dueDate?: string): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!task.trim()) {
    errors.task = 'Task text is required'
  }

  if (dueDate) {
    const date = new Date(dueDate)
    if (isNaN(date.getTime())) {
      errors.dueDate = 'Invalid date format'
    }
  }

  return errors
}