'use client'

import { TaskForm } from '@/components/TaskForm'
import { TaskList } from '@/components/TaskList'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAppSelector } from '@/store/hooks'

export default function Home() {
  const tasks = useAppSelector(state => state.tasks.tasks)

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
      <ThemeToggle />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Tasks
        </h1>
        <TaskForm />
        <TaskList tasks={tasks} />
      </div>
    </main>
  )
}