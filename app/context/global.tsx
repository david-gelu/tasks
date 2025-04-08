'use client'

import { createContext, useState, useContext, useCallback, useMemo, useEffect } from "react"
import themes from "./themes"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Todo, GlobalContextType } from "@/types"
import { useSession, signOut } from "next-auth/react"

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

interface Props {
  children: React.ReactNode
}

export function GlobalProvider({ children }: Props) {
  const [modal, setModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      setAllTasks([])
      setIsAuthReady(true)
    },
  })
  const [selectedTheme, setSelectedTheme] = useState('dark')
  const [collapsed, setCollapsed] = useState(true)
  const [taskBeingEdited, setTaskBeingEdited] = useState<Partial<Todo> | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [allTasks, setAllTasks] = useState<Todo[]>([])
  const [isAuthReady, setIsAuthReady] = useState(false)

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

  const fetchTasks = useCallback(async () => {
    if (!session?.user?.id || status !== 'authenticated') return

    try {
      setIsLoading(true)
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${session.user.id}`,
        }
      })
      if (!response.ok) throw new Error('Failed to fetch tasks')
      const data = await response.json()
      setAllTasks(data)
    } catch (error) {
      toast.error("Failed to fetch tasks")
      setAllTasks([])
    } finally {
      setIsLoading(false)
    }
  }, [session, status])

  useEffect(() => {
    if (status === 'loading') {
      setIsAuthReady(false)
      return
    }

    setIsAuthReady(true)

    if (status === 'authenticated' && session?.user) {
      fetchTasks()
    } else {
      setAllTasks([])
    }
  }, [status, session, fetchTasks])

  const deleteTask = async (id: string) => {
    try {
      const res = await axios.delete(`/api/tasks/${id}`)
      toast.success("Task deleted")
      fetchTasks()
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  const editTask = async (todo: Todo, id: string) => {
    try {
      const res = await axios.put(`/api/tasks/${id}`, todo)
      toast.success("Task edited")
      fetchTasks()
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  const updateTask = async (todo: Todo) => {
    try {
      const res = await axios.put(`/api/tasks`, todo)
      toast.success("Task updated")

      fetchTasks()
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  const handleLogout = async () => {
    try {
      setIsAuthReady(false)
      await signOut({
        redirect: true,
        callbackUrl: '/auth/signin'
      })
    } catch (error) {
      console.error('Logout error:', error)
      setIsAuthReady(true)
    }
  }

  const filteredTasks = useMemo(() => {
    return allTasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [allTasks, searchTerm])

  const completedTasks = filteredTasks.filter((todo: Todo) => todo.isCompleted === true)
  const importantTasks = filteredTasks.filter((todo: Todo) => todo.isImportant === true)
  const incompleteTasks = filteredTasks.filter((todo: Todo) => todo.isCompleted === false)

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <GlobalContext.Provider
      value={{
        theme,
        changeThemeColor,
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
        fetchTasks,
        collapsed,
        collapseMenu,
        searchTerm,
        setSearchTerm,
        filteredTasks,
        userImage,
        handleLogout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalState = () => {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalProvider')
  }
  return context
}
