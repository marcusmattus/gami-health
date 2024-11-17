import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Create food log
    const foodLog = await prisma.foodLog.create({
      data: {
        userId: session.user.id,
        foodItem: data.foodItem,
        calories: data.calories,
        isHealthy: data.isHealthy,
        description: data.description,
        points: data.points,
        imageUrl: data.imageUrl,
      },
    })

    // Update user points
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        points: {
          increment: data.points,
        },
      },
    })

    return NextResponse.json(foodLog)
  } catch (error) {
    console.error('Error saving food log:', error)
    return NextResponse.json({ error: 'Failed to save food log' }, { status: 500 })
  }
} 