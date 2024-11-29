'use client'

import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './taskSlice'

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['tasks/setTasks'],
        ignoredActionPaths: [
          'payload.createdAt',
          'payload.dueDate',
          'tasks.tasks.createdAt',
          'tasks.tasks.dueDate'
        ],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 