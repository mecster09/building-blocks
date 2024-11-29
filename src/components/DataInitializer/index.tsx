'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setTasks } from '@/store/taskSlice'
import { db } from '@/store/database'

export function DataInitializer() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const loadTasks = async () => {
      const tasks = await db.getTasks()
      dispatch(setTasks(tasks))
    }

    loadTasks()
  }, [dispatch])

  return null
} 