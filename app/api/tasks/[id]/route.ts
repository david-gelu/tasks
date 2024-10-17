import prisma from "@/app/utils/connect"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()
    const { id } = params

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const task = await prisma.todo.delete({ where: { id } })

    return NextResponse.json(task)
  } catch (error) {
    console.log("ERROR DELETING TASK: ", error)
    return NextResponse.json({ error: "Error deleting task", status: 500 })
  }
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {

  try {
    const user = await currentUser()
    const { id } = params
    const { taskData } = await req.json()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', status: 401 })
    }
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required', status: 400 })
    }

    const task = await prisma.todo.update({
      where: { id },
      data: {
        title: taskData.title,
        description: taskData.description,
        date: taskData.date,
        isCompleted: taskData.isCompleted,
        isImportant: taskData.isImportant,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('ERROR UPDATING TASK:', error)
    return NextResponse.json({ error: 'Error updating task', status: 500 })
  }
}