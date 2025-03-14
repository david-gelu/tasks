'use client'

import { createContext, useState, useContext, useEffect, ReactNode, useCallback, useMemo } from "react"
import themes from "./themes"
import axios from "axios"
import { Todo } from "@prisma/client"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from 'next/image'

interface GlobalContextType {
  theme: {
    name: string;
    [key: string]: any;
  };
  tasks: Todo[];
  deleteTask: (id: string) => Promise<void>;
  editTask: (todo: Todo, id: string) => Promise<void>;
  taskBeingEdited: Partial<Todo> | null;
  editTaskModal: (task: Todo) => void;
  createNewTaskModal: () => void;
  isLoading: boolean;
  completedTasks: Todo[];
  importantTasks: Todo[];
  incompleteTasks: Todo[];
  updateTask: (todo: Todo) => Promise<void>;
  modal: boolean;
  openModal: () => void;
  closeModal: () => void;
  allTasks: () => Promise<void>;
  collapsed: boolean;
  collapseMenu: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredTasks: Todo[];
  changeThemeColor: (newTheme: string) => void;
  userImage: string;
}

export const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType)
export const GlobalUpdateContext = createContext<GlobalContextType>({} as GlobalContextType)

interface Props {
  children: ReactNode
}

export const GlobalProvider = ({ children }: Props) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [selectedTheme, setSelectedTheme] = useState('dark')
  const [isLoading, setIsLoading] = useState(false)
  const [tasks, setTasks] = useState<Todo[]>([])
  const [modal, setModal] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const [taskBeingEdited, setTaskBeingEdited] = useState<Partial<Todo> | null>(null)
  const [searchTerm, setSearchTerm] = useState("");

  const theme = themes.find(a => a.name === selectedTheme) || themes[0]

  const userImage = session?.user?.image || '/images/user-logo.png'

  const openModal = () => setModal(true)

  const changeThemeColor = (newTheme: string) => {
    setSelectedTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
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

  const allTasks = useCallback(async () => {
    if (!session?.user) return

    setIsLoading(true)
    try {
      const res = await axios.get("/api/tasks")
      setTasks(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.log(error)
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }, [session?.user])

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

  const filteredTasks = useMemo(() => {
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [tasks, searchTerm])

  const completedTasks = filteredTasks.filter((todo: Todo) => todo.isCompleted === true)
  const importantTasks = filteredTasks.filter((todo: Todo) => todo.isImportant === true)
  const incompleteTasks = filteredTasks.filter((todo: Todo) => todo.isCompleted === false)

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
        userImage,
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
        userImage,
      }}>
        {children}
      </GlobalUpdateContext.Provider>
    </GlobalContext.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalContext)
export const useGlobalUpdate = () => useContext(GlobalUpdateContext)
