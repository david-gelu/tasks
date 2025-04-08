'use client'

import { useGlobalState } from '@/app/context/global'
import Tasks from '@/app/components/tasks/Tasks'
import { useEffect } from 'react'

export default function IncompletePage() {
  const { allTasks, fetchTasks } = useGlobalState()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const incompleteTasks = Array.isArray(allTasks)
    ? allTasks.filter(task => !task.isCompleted)
    : []

  return (
    <div>
      <Tasks title="Tasks To Do" tasks={incompleteTasks} />
    </div>
  )
}
