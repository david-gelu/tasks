'use client'

import { useGlobalState } from '@/app/context/global'
import Tasks from '@/app/components/tasks/Tasks'
import { useEffect } from 'react'

export default function CompletedPage() {
  const { allTasks, fetchTasks } = useGlobalState()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const completedTasks = Array.isArray(allTasks)
    ? allTasks.filter(task => task.isCompleted)
    : []

  return (
    <div>
      <Tasks title="Completed Tasks" tasks={completedTasks} />
    </div>
  )
}
