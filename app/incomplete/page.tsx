"use client"

import Tasks from "../components/tasks/Tasks"
import { useGlobalState } from "../context/global"

function page() {
  const { incompleteTasks } = useGlobalState()
  return <Tasks title="Incomplete Tasks" tasks={incompleteTasks} />
}

export default page
