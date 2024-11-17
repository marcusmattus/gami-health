import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/app/lib/prisma'
import { authOptions } from '@/app/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { points } = await req.json()

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        points: points,
      },
    })

    return NextResponse.json({
      points: updatedUser.points,
    })
  } catch (error) {
    console.error('Error updating points:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update points' },
      { status: 500 }
    )
  }
} 