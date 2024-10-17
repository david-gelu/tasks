"use client"

import { useGlobalState } from "@/app/context/global"
import CreateContent from "../modals/CreateContent"
import styled from "styled-components"
import TaskItem from "../TaskItem/TaskItem"
import { add, plus } from "@/app/utils/Icons"
import Modal from "../modals/Modal"
import Loading from "../loading/Loading"
import { Todo } from "@prisma/client"

interface Props {
  title: string
  tasks: Todo[]
}

function Tasks({ title, tasks }: Props) {
  const { theme, isLoading, openModal, modal, searchTerm, setSearchTerm, filteredTasks } = useGlobalState()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchTerm(e.target.value) }

  return (
    <TaskStyled theme={theme}>
      {modal && <Modal content={<CreateContent />} />}
      <div className="tasks-header">
        <h1>{title}</h1>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button className="btn-rounded" onClick={openModal}>{plus}</button>
      </div>
      {isLoading ? <Loading /> :
        <div className="tasks grid">
          {tasks.length > 0 && tasks.map((task: any) => (
            <TaskItem
              key={task.id}
              title={task.title}
              description={task.description}
              date={task.date}
              isCompleted={task.isCompleted}
              id={task.id}
            />
          ))}
          <button className="create-task" onClick={openModal}>
            {add} Add New Task
          </button>
        </div>
      }
    </TaskStyled >
  )
}

const TaskStyled = styled.main`
  position: relative;
  padding: 2em;
  width: 100%;
  background-color: ${({ theme }) => theme.colorBg2};
  box-shadow:0 0 5px 5px ${({ theme }) => theme.colorGreenDark};
  /* border: 5px solid ${({ theme }) => theme.colorGreenDark}; */
  /* border: 2px solid ${({ theme }) => theme.colorIcons}; */
  border-radius: 1rem;
  height: 100%;
  max-height: calc(100dvh - 5em);

  overflow-y: hidden;
  @media screen and (max-width: 768px) {
    max-height: calc(100dvh + 5em);
  }
  .tasks-header{
    display: flex;
    align-items:center;
    justify-content:space-between;
    gap: 1.5em;
    & > h1 {
      font-size: clamp(1.2rem, 2vw, 1.7rem);
      font-weight: 800;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        bottom: -0.5em;
        left: 0;
        width: 100%;
        height: 0.2em;
        background-color: ${({ theme }) => theme.colorPrimaryGreen};
        border-radius: 0.5em;
      }
    }
  }
  .btn-rounded {
    position: fixed;
    top: 3em;
    right: 3em;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colorBg};
    border: 2px solid ${({ theme }) => theme.borderColor2};
    box-shadow:  ${({ theme }) => ` 0 0px 3px ${theme.color1}`};
    color: ${({ theme }) => theme.color1};
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 768px) {
      top: 2.5em;
      right: 1.5em;
    }
  }
  .tasks {
    margin: 2em -1em 2em 0;
    max-height: calc(100dvh - 15em);
    overflow-y: auto;
    padding-inline-end: 1em;
  }

  .create-task {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    height: 10em;
    color: ${({ theme }) => theme.color1};
    font-weight: 600;
    cursor: pointer;
    border-radius: 1em;
    border: 3px dashed ${({ theme }) => theme.colorGrey5};
    transition: all 0.3s ease;
    i {
      font-size: 1.5rem;
      margin-right: 0.2em;
    }
    &:hover {
      background-color: ${({ theme }) => theme.colorGrey5};
      color: ${({ theme }) => theme.color1};
    }
  }
  .search-input {
    max-width: 20em;
    margin-right: 3.5em;
    padding: 0.35em 1em;
    border-radius: 0.5em;
    border: 2px solid ${({ theme }) => theme.colorIcons};
    font-size: 1rem;
    outline: none;
  }
`;

export default Tasks;
