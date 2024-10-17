"use client"
import { useGlobalState } from "@/app/context/global"
import formatDate from "@/app/utils/formatDate"
import { edit, trash } from "@/app/utils/Icons"
import React from "react"
import styled from "styled-components"
import Modal from "../modals/Modal"
import CreateContent from "../modals/CreateContent"
import { Todo } from "@prisma/client"

interface Props {
  title: string
  description: string
  date: string
  isCompleted: boolean
  id: string
}

function TaskItem({ title, description, date, isCompleted, id }: Props) {
  const { theme, deleteTask, updateTask, modal, openModal, taskBeingEdited, editTaskModal, importantTasks } = useGlobalState()
  return (
    <TaskItemStyled theme={theme} important={importantTasks.find((task: Todo) => task.id === id && task.isImportant)}>
      {/* <h1>{title}</h1> */}
      <span>{description}</span>
      <span className="date">{formatDate(date)}</span>
      <div className="task-footer">
        {isCompleted ? (
          <button
            className="completed"
            onClick={() => {
              const task = { id, isCompleted: !isCompleted }
              updateTask(task)
            }}
          >
            Completed
          </button>
        ) : (
          <button
            className="incomplete"
            onClick={() => {
              const task = { id, isCompleted: !isCompleted }
              updateTask(task)
            }}
          >
            Incomplete
          </button>
        )}
        <button className="edit" onClick={() => editTaskModal({ title, description, date, isCompleted, id })}>{edit}</button>
        <button className="delete" onClick={() => deleteTask(id)}>{trash}</button>
      </div>
      {modal &&
        <Modal content={taskBeingEdited ? <CreateContent taskData={taskBeingEdited} /> : <CreateContent />} />
      }
    </TaskItemStyled>
  )
}

const TaskItemStyled = styled.div<{ important: boolean }>`
  padding: 1rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colorBg};
  /* box-shadow: ${({ theme }) => theme.shadow7}; */
  border: 2px solid ${({ theme, important }) => important ? theme.colorDanger : theme.colorIcons};
  width:100%;
  height: 10rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
    }
    .edit {
      margin-left: auto;
    }
    .completed,
    .incomplete {
      display: inline-block;
      padding: 0.2em 1em;
      background: ${({ theme }) => theme.colorDanger};
      border-radius: 10px;
      font-size: 0.8rem;
    }
    .completed {
      background: ${({ theme }) => theme.colorGreenDark} !important;
color:${({ theme }) => theme.colorWhite} !important;
    
    }
  }
`;

export default TaskItem;
