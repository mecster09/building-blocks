import localforage from 'localforage'
import { Task } from '@/types/task'

// Create a device-specific ID that persists
const getDeviceId = () => {
  if (typeof window === 'undefined') return 'server'
  
  let deviceId = window.localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    window.localStorage.setItem('deviceId', deviceId)
  }
  return deviceId
}

const store = localforage.createInstance({
  name: `taskApp_${getDeviceId()}`,
  storeName: 'tasks',
  driver: [
    localforage.INDEXEDDB,
    localforage.WEBSQL,
    localforage.LOCALSTORAGE
  ]
})

// Handle cross-tab communication
if (typeof window !== 'undefined') {
  const channel = new BroadcastChannel('taskApp_sync')
  
  // Listen for changes from other tabs
  channel.onmessage = async (event) => {
    if (event.data.type === 'TASK_UPDATE') {
      await store.setItem('tasks', event.data.tasks)
    } else if (event.data.type === 'CATEGORY_ORDER_UPDATE') {
      await store.setItem('categoryOrder', event.data.order)
    }
  }
}

export const db = {
  async addTask(task: Task) {
    const tasks = await this.getTasks()
    tasks.push(task)
    await store.setItem('tasks', tasks)
    this.broadcastUpdate(tasks)
  },

  async getTasks(): Promise<Task[]> {
    return await store.getItem('tasks') || []
  },

  async updateTasks(tasks: Task[]) {
    await store.setItem('tasks', tasks)
    this.broadcastUpdate(tasks)
  },

  async deleteTasks(tasks: Task[]) {
    await store.setItem('tasks', tasks)
    this.broadcastUpdate(tasks)
  },

  async clearTasks() {
    await store.clear()
    this.broadcastUpdate([])
  },

  // New methods for category order
  async getCategoryOrder(): Promise<string[]> {
    return await store.getItem('categoryOrder') || []
  },

  async updateCategoryOrder(order: string[]) {
    await store.setItem('categoryOrder', order)
    this.broadcastCategoryUpdate(order)
  },

  // Broadcast changes to other tabs
  broadcastUpdate(tasks: Task[]) {
    if (typeof window !== 'undefined') {
      const channel = new BroadcastChannel('taskApp_sync')
      channel.postMessage({ type: 'TASK_UPDATE', tasks })
    }
  },

  broadcastCategoryUpdate(order: string[]) {
    if (typeof window !== 'undefined') {
      const channel = new BroadcastChannel('taskApp_sync')
      channel.postMessage({ type: 'CATEGORY_ORDER_UPDATE', order })
    }
  }
} 