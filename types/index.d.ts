import { Theme } from '@/app/context/themes'

export interface Todo {
  id: string
  title: string
  description: string | null | undefined
  date: string
  isCompleted: boolean
  isImportant: boolean
  createdAt: Date
  updatedAt: Date | null
  userId: string
}

export interface GlobalContextType {
  theme: Theme
  changeThemeColor: (theme: string) => void
  deleteTask: (id: string) => Promise<void>
  editTask: (todo: Todo, id: string) => Promise<void>
  taskBeingEdited: Partial<Todo> | null
  editTaskModal: (task: Todo) => void
  createNewTaskModal: () => void
  isLoading: boolean
  completedTasks: Todo[]
  importantTasks: Todo[]
  incompleteTasks: Todo[]
  updateTask: (todo: Todo) => Promise<void>
  modal: boolean
  openModal: () => void
  closeModal: () => void
  allTasks: Todo[]
  fetchTasks: () => Promise<void>
  collapsed: boolean
  collapseMenu: () => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  filteredTasks: Todo[]
  userImage: string
  handleLogout: () => Promise<void>
}