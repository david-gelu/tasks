import { createContext, useState, useContext, useEffect, ReactNode } from "react"
import themes from "./themes"
import axios from "axios"
import { useUser } from "@clerk/nextjs"
import { Todo } from "@prisma/client"
import toast from "react-hot-toast"

export const GlobalContext = createContext<any>({})
export const GlobalUpdateContext = createContext<any>({})

interface Props {
  children: ReactNode
}

export const GlobalProvider = ({ children }: Props) => {
  const { user } = useUser()

  const [selectedTheme, setSelectedTheme] = useState('dark')
  const [isLoading, setIsLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [taskBeingEdited, setTaskBeingEdited] = useState<Partial<Todo> | null>(null)
  const [tasks, setTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState("");

  const theme = themes.find(a => a.name === selectedTheme)

  const openModal = () => setModal(true)

  const changeThemeColor = (newTheme: string) => {
    setSelectedTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    console.log(`newTheme:`, newTheme)
    console.log(`heme:`, theme)
  }

  const closeModal = () => {
    setModal(false)
    setTaskBeingEdited(null)
  }

  const editTaskModal = (task: Todo) => {
    setTaskBeingEdited(task)
    openModal()
  }

  const createNewTaskModal = () => {
    setTaskBeingEdited(null)
    openModal()
  }

  const collapseMenu = () => { setCollapsed(!collapsed) }

  const allTasks = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get("/api/tasks")
      const sorted = res.data.sort((a: Todo, b: Todo) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      })
      setTasks(sorted)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const res = await axios.delete(`/api/tasks/${id}`)
      toast.success("Task deleted")
      allTasks()
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  const editTask = async (todo: Todo, id: string) => {
    try {
      const res = await axios.put(`/api/tasks/${id}`, todo)
      toast.success("Task edited")

      allTasks()
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  const updateTask = async (todo: Todo) => {
    try {
      const res = await axios.put(`/api/tasks`, todo)

      toast.success("Task updated")

      allTasks()
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  const filteredTasks = tasks.filter((task: Todo) =>
    task?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description && task?.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedTasks = filteredTasks.filter((todo: Todo) => todo.isCompleted === true)
  const importantTasks = filteredTasks.filter((todo: Todo) => todo.isImportant === true)
  const incompleteTasks = filteredTasks.filter((todo: Todo) => todo.isCompleted === false)

  useEffect(() => {
    if (user) allTasks()
  }, [user])

  return (
    <GlobalContext.Provider
      value={{
        theme,
        changeThemeColor,
        tasks,
        deleteTask,
        editTask,
        taskBeingEdited,
        editTaskModal,
        createNewTaskModal,
        isLoading,
        completedTasks,
        importantTasks,
        incompleteTasks,
        updateTask,
        modal,
        openModal,
        closeModal,
        allTasks,
        collapsed,
        collapseMenu,
        searchTerm,
        setSearchTerm,
        filteredTasks,
      }}
    >
      <GlobalUpdateContext.Provider value={{
        theme,
        changeThemeColor,
        tasks,
        deleteTask,
        isLoading,
        completedTasks,
        importantTasks,
        incompleteTasks,
        updateTask,
        editTask,
        taskBeingEdited,
        editTaskModal,
        createNewTaskModal,
        modal,
        openModal,
        closeModal,
        allTasks,
        collapsed,
        collapseMenu,
        searchTerm,
        setSearchTerm,
        filteredTasks,
      }}>
        {children}
      </GlobalUpdateContext.Provider>
    </GlobalContext.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalContext)
export const useGlobalUpdate = () => useContext(GlobalUpdateContext)
