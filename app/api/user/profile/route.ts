import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import prisma from '@/app/utils/connect'
import { authOptions } from '@/app/lib/auth/auth-options'

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, email } = await req.json()

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        email: email || undefined,
      }
    })

    // Force session update
    await prisma.session.updateMany({
      where: { userId: session.user.id },
      data: { expires: new Date(Date.now()) }
    })

    return NextResponse.json({
      success: true,
      user: {
        name: updatedUser.name,
        email: updatedUser.email
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}