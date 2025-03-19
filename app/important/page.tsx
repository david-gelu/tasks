'use client'

import { useGlobalState } from '@/app/context/global'
import Tasks from '@/app/components/tasks/Tasks'
import { useEffect } from 'react'

export default function ImportantPage() {
  const { allTasks, fetchTasks } = useGlobalState()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const importantTasks = Array.isArray(allTasks)
    ? allTasks.filter(task => task.isImportant)
    : []

  return (
    <div>
      <Tasks title="Important Tasks" tasks={importantTasks} />
    </div>
  )
}
