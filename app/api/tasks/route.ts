import prisma from "@/app/utils/connect"
import { useAuth } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized", status: 401 })
    }

    const { title = '', description, date, completed, important } = await req.json()

    if (!title || !description || !date) {
      return NextResponse.json({
        error: "Missing required fields",
        status: 400,
      })
    }

    if (description.length < 3) {
      return NextResponse.json({
        error: "Description must be at least 3 characters long",
        status: 400,
      })
    }

    const task = await prisma.todo.create({
      data: {
        title,
        description,
        date,
        isCompleted: completed,
        isImportant: important,
        userId: user?.id,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.log("ERROR CREATING TASK: ", error)
    return NextResponse.json({ error: "Error creating task", status: 500 })
  }
}

export async function GET(req: Request) {

  try {
    const user = await currentUser()

    if (!user) return NextResponse.json({ error: "Unauthorized", status: 401 })


    const tasks = await prisma.todo.findMany({ where: { userId: user.id } })

    return NextResponse.json(tasks)
  } catch (error) {
    console.log("ERROR GETTING TASKS: ", error)
    return NextResponse.json({ error: "Error updating task", status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const user = await currentUser()
    const { isCompleted, id } = await req.json()

    if (!user) return NextResponse.json({ error: "Unauthorized", status: 401 })

    const task = await prisma.todo.update({
      where: { id },
      data: { isCompleted },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.log("ERROR UPDATING TASK: ", error)
    return NextResponse.json({ error: "Error deleting task", status: 500 })
  }
}
