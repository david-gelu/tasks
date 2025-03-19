'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Tasks from '@/app/components/tasks/Tasks'
import { useGlobalState } from "@/app/context/global"

export default function TasksPage() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const { fetchTasks, allTasks, isLoading } = useGlobalState()

  useEffect(() => {
    const loadData = async () => {
      if (status === 'authenticated' && session?.user) {
        await fetchTasks()
      }
    }

    loadData()
  }, [status, session, fetchTasks])

  const filteredTasks = allTasks.filter(task => {
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