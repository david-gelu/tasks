"use client"
import axios from "axios"
import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import styled from "styled-components"
import { add, edit, plus } from "@/app/utils/Icons"
import { useGlobalState } from "@/app/context/global"
import Button from "../button/Button"
import { Todo } from "@prisma/client"
import moment from "moment"

function CreateContent({ taskData }: { taskData?: Partial<Todo> }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"))
  const [completed, setCompleted] = useState(false)
  const [important, setImportant] = useState(false)


  // UseEffect to handle task editing
  useEffect(() => {
    if (taskData) {
      // Prepopulate the form with task data when editing
      setTitle(taskData.title || '')
      setDescription(taskData.description || '')
      setDate(taskData.date || moment().format("YYYY-MM-DD"))
      setCompleted(taskData.isCompleted || false)
      setImportant(taskData.isImportant || false)
    }
  }, [taskData])

  const { theme, allTasks, closeModal } = useGlobalState()

  const handleChange = (name: string) => (e: any) => {
    switch (name) {
      case "title":
        setTitle(e.target.value)
        break
      case "description":
        setDescription(e.target.value)
        break
      case "date":
        setDate(e.target.value)
        break
      case "completed":
        setCompleted(e.target.checked)
        break
      case "important":
        setImportant(e.target.checked)
        break
      default:
        break
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const task = {
      title,
      description,
      date,
      isCompleted: completed,
      isImportant: important,
    }

    try {
      let res
      if (taskData?.id) {
        res = await axios.put(`/api/tasks/${taskData?.id}`, { taskData: task })
      } else {
        res = await axios.post("/api/tasks", task)
      }

      if (res.data.error) {
        toast.error(res.data.error)
      } else {
        toast.success(taskData?.id ? "Task updated successfully." : "Task created successfully.")
        allTasks()
        closeModal()
      }
    } catch (error) {
      toast.error("Something went wrong.")
      console.log(error)
    }
  }

  return (
    <CreateContentStyled onSubmit={handleSubmit} theme={theme}>
      <h1>Create a Task</h1>
      {/* <div className="input-control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          name="title"
          onChange={handleChange("title")}
          placeholder="e.g, Watch a video from Fireship."
        />
      </div> */}
      <div className="input-control">
        <label htmlFor="description">Description</label>
        <textarea
          value={description}
          onChange={handleChange("description")}
          name="description"
          id="description"
          maxLength={100}
          required
          rows={2}
          placeholder="e.g, Watch a video about Next.js Auth"
        ></textarea>
      </div>
      <div className="input-control">
        <label htmlFor="date">Date</label>
        <input
          value={date}
          onChange={handleChange("date")}
          type="date"
          name="date"
          id="date"
          required
        />
      </div>
      <div className="input-control toggler">
        <label htmlFor="completed">Toggle Completed</label>
        <input
          value={completed.toString()}
          onChange={handleChange("completed")}
          type="checkbox"
          name="completed"
          id="completed"
        />
      </div>
      <div className="input-control toggler">
        <label htmlFor="important">Toggle Important</label>
        <input
          value={important.toString()}
          onChange={handleChange("important")}
          type="checkbox"
          name="important"
          id="important"
        />
      </div>

      <div className="submit-btn flex justify-end">
        <Button
          type="submit"
          name={`${taskData && taskData?.id ? 'Update task' : 'Create Task'}`}
          icon={taskData && taskData?.id ? edit : add}
          padding={"0.5em 1em"}
          borderRad={"0.8rem"}
          fs={"1rem"}
          background={theme.colorGreenLight}
        />
      </div>
    </CreateContentStyled>
  )
}

const CreateContentStyled = styled.form`
  > h1 {
    font-size: clamp(1.2rem, 5vw, 1.6rem);
    font-weight: 600;
  }

  color: ${({ theme }) => theme.color1};

  .input-control {
    position: relative;
    margin: 1em 0;
    font-weight: 500;

    @media screen and (max-width: 450px) {
      margin: 1rem 0;
    }

    label {
      display: inline-block;
      font-size: clamp(0.9rem, 5vw, 1.2rem);

      span {
        color: ${({ theme }) => theme.color1};
      }
    }

    :is(input, textarea) {
      width: 100%;
      padding: 0.5em;

      resize: none;
      background-color: ${({ theme }) => theme.colorBg2};
      color: ${({ theme }) => theme.color1};
      border-radius: 0.5em;
      border: 2px solid ${({ theme }) => theme.colorIcons};
      transition: border-color 0.3s ease;;
      &::placeholder {
        color: lighten(#242424, 50%);
      }

      &:not(:placeholder-shown):user-valid {
        border-color: ${({ theme }) => theme.colorSuccess};
      }

      &:not(:placeholder-shown):user-invalid {
        border-color: ${({ theme }) => theme.colorDanger};
        color:  ${({ theme }) => theme.colorDanger} !important ;
      }

      &:focus:invalid {
        border-color: ${({ theme }) => theme.colorWarning};
      }
    }
  }
  .submit-btn button {
    transition: all 0.35s ease-in-out;

    @media screen and (max-width: 500px) {
      font-size: 0.9rem !important;
      padding: 0.6em 1em !important;

      i {
        font-size: 1.2rem !important;
        margin-right: 0.5em !important;
      }
    }
  }

  .toggler {
    display: flex;
    align-items: center;
    justify-content: space-between;

    cursor: pointer;

    label {
      flex: 1;
    }

    input {
      width: initial;
    }
  }
`;

export default CreateContent;
