import prisma from "@/app/utils/connect"
import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/lib/auth/auth-options"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tasks = await prisma.todo.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        isCompleted: true,
        isImportant: true,
        createdAt: true,
        updatedAt: true,
        userId: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(tasks)

  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, date, isImportant = false } = await req.json()

    const task = await prisma.todo.create({
      data: {
        title,
        description,
        date,
        isImportant,
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { isCompleted, id } = await req.json()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized", status: 401 })
    }

    const task = await prisma.todo.update({
      where: {
        id,
        userId: session.user.id
      },
      data: { isCompleted },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.log("ERROR UPDATING TASK: ", error)
    return NextResponse.json({ error: "Error updating task", status: 500 })
  }
}
