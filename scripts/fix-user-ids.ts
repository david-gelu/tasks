import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixUserIds() {
  try {
    // Get all tasks with string userId
    const tasksToFix = await prisma.todo.findMany({
      where: {
        userId: "user_test"
      }
    })

    console.log(`Found ${tasksToFix.length} tasks to fix`)

    // Get the correct user ID
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: "test" },
          { name: "user_test11" }
        ]
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Update all tasks with the correct ObjectId
    const updates = tasksToFix.map(task =>
      prisma.todo.update({
        where: { id: task.id },
        data: { userId: user.id }
      })
    )

    await Promise.all(updates)
    console.log('Successfully updated all tasks')

  } catch (error) {
    console.error('Error fixing user IDs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixUserIds()