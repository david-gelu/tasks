'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useGlobalState } from '@/app/context/global'
import Tasks from '@/app/components/tasks/Tasks'

export default function TasksPage() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const { fetchTasks, allTasks, isLoading } = useGlobalState()
  const [initialFetchDone, setInitialFetchDone] = useState(false)



  useEffect(() => {
    const loadTasks = async () => {
      if (status === 'authenticated' && session?.user && !initialFetchDone) {
        try {
          await fetchTasks()
          setInitialFetchDone(true)
        } catch (error) {
          console.error('Error fetching tasks:', error)
        }
      }
    }

    loadTasks()
  }, [status, session, fetchTasks, initialFetchDone])

  // Ensure allTasks is an array before filtering
  const tasks = Array.isArray(allTasks) ? allTasks : []

  const filteredTasks = tasks.filter(task => {
    switch (pathname) {
      case '/incomplete':
        return !task.isCompleted
      case '/completed':
        return task.isCompleted
      case '/important':
        return task.isImportant
      default:
        return true
    }
  })

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div>
      <Tasks
        title={pathname.substring(1).charAt(0).toUpperCase() + pathname.slice(2)}
        tasks={filteredTasks}
      />
    </div>
  )
}