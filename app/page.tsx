"use client"

import Tasks from "./components/tasks/Tasks"
import { useGlobalState } from "./context/global"

export default function Home() {
  const { filteredTasks } = useGlobalState()

  return <Tasks title="All Tasks" tasks={filteredTasks} />
}
