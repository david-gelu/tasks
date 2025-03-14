import { requestLock } from "@/app/utils/requestLock"
import prisma from "@/app/utils/connect"
import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/lib/auth/auth-options"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const lockKey = `delete-task-${params.id}`

  try {
    return await requestLock.withLock(lockKey, async () => {
      const session = await getServerSession(authOptions)

      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const { id } = params

      await prisma.todo.delete({
        where: {
          id,
          userId: session.user.id
        },
      })

      return NextResponse.json({ message: "Task deleted successfully" })
    })
  } catch (error: any) {
    if (error.message === 'Operation in progress') {
      return NextResponse.json(
        { error: "Delete operation already in progress" },
        { status: 429 }
      )
    }
    console.error("ERROR DELETING TASK: ", error)
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const lockKey = `update-task-${params.id}`

  try {
    return await requestLock.withLock(lockKey, async () => {
      const { id } = params
      const { taskData } = await req.json()
      const session = await getServerSession(authOptions)

      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Find the task first to get its MongoDB ObjectId
      const existingTask = await prisma.todo.findUnique({
        where: {
          id,
          userId: session.user.id
        }
      })

      if (!existingTask) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 })
      }

      const task = await prisma.todo.update({
        where: {
          id: existingTask.id,
          userId: session.user.id
        },
        data: {
          title: taskData.title,
          description: taskData.description,
          date: taskData.date,
          isCompleted: taskData.isCompleted,
          isImportant: taskData.isImportant,
          updatedAt: new Date()
        },
      })

      return NextResponse.json(task)
    })
  } catch (error: any) {
    console.error('ERROR UPDATING TASK:', error)

    if (error.message === 'Operation in progress') {
      return NextResponse.json(
        { error: "Update operation already in progress" },
        { status: 429 }
      )
    }

    if (error.code === 'P2023') {
      return NextResponse.json(
        { error: "Invalid task ID format" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error updating task" },
      { status: 500 }
    )
  }
}