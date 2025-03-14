"use client"
import { useGlobalState } from "@/app/context/global"
import formatDate from "@/app/utils/formatDate"
import { edit, trash } from "@/app/utils/Icons"
import { useState } from "react"
import styled from "styled-components"
import Modal from "../modals/Modal"
import CreateContent from "../modals/CreateContent"
import { Todo } from "@prisma/client"
import { toast } from "react-hot-toast"
import axios from "axios"

interface Props {
  title: string
  description: string
  date: string
  isCompleted: boolean
  id: string
  isImportant?: boolean
}

function TaskItem({ title, description, date, isCompleted, id, isImportant = false }: Props) {
  const { theme, modal, openModal, taskBeingEdited, editTaskModal, allTasks } = useGlobalState()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDelete = async () => {
    if (isDeleting) return

    try {
      setIsDeleting(true)
      const res = await axios.delete(`/api/tasks/${id}`)

      if (res.status === 429) {
        toast.error('Please wait, delete in progress')
        return
      }

      toast.success('Task deleted successfully')
      allTasks()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error deleting task')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (updateData: Partial<Todo>) => {
    if (isUpdating) return

    try {
      setIsUpdating(true)
      const res = await axios.put(`/api/tasks/${id}`, {
        taskData: updateData
      })

      if (res.status === 429) {
        toast.error('Please wait, update in progress')
        return
      }

      await allTasks()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error updating task')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEditClick = () => {
    editTaskModal({
      id,
      title,
      description,
      date,
      isCompleted,
      isImportant,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: ''
    })
  }

  return (
    <TaskItemStyled
      theme={theme}
      important={Boolean(isImportant)}
      completed={Boolean(isCompleted)}
    >
      <strong>{title}</strong>
      <span>{description}</span>
      <span className="date">{formatDate(date)}</span>
      <div className="task-footer">
        <button
          className={`status-btn ${isCompleted ? 'completed' : 'incomplete'} ${isUpdating ? 'disabled' : ''}`}
          onClick={() => handleUpdate({ isCompleted: !isCompleted })}
          disabled={isUpdating}
        >
          {isCompleted ? 'Completed' : 'Incomplete'}
        </button>
        <button
          className={`edit ${isUpdating ? 'disabled' : ''}`}
          onClick={handleEditClick}
          disabled={isUpdating}
        >
          {edit}
        </button>
        <button
          className={`delete ${isDeleting ? 'disabled' : ''}`}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? '...' : trash}
        </button>
      </div>
      {modal && taskBeingEdited && <Modal content={<CreateContent taskData={taskBeingEdited} />} />}
    </TaskItemStyled>
  )
}

const TaskItemStyled = styled.div<{ important: boolean; completed: boolean }>`
  padding: 1rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colorBg};
  border: 2px solid ${({ theme, important, completed }) => {
    if (completed) return theme.colorGreenDark;
    if (important) return theme.colorDanger;
    return theme.colorIcons;
  }};
  box-shadow: ${({ theme, important }) =>
    important ? `0 0 5px ${theme.colorDanger}` : 'none'};
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: ${({ completed }) => completed ? 0.7 : 1};
  position: relative;
  transition: all 0.3s ease;

  strong {
    color: ${({ theme, completed, important }) => {
    if (completed) return theme.colorGrey3;
    if (important) return theme.colorDanger;
    return theme.colorGreenDark;
  }};
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .date {
    margin-top: auto;
  }
  & > h1 {
    display: inline-block;
    font-weight: 600;
  }
  .task-footer {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    width:100%;
    button {
      width:max-content;
      cursor: pointer;
      font-weight: 700;
      i {
        font-size: 1rem;
        color: ${({ theme }) => theme.color1};
      }
      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    .status-btn {
      display: inline-block;
      padding: 0.2em 1em;
      border-radius: 10px;
      font-size: 0.8rem;
      transition: all 0.3s ease;

      &.completed {
        background: ${({ theme }) => theme.colorGreenDark};
        color: ${({ theme }) => theme.colorWhite};
      }

      &.incomplete {
        background: ${({ theme }) => theme.colorDanger};
        color: ${({ theme }) => theme.colorWhite};
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    .edit, .delete {
      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
  .delete-btn {
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

export default TaskItem;
