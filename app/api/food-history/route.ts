import { NextResponse } from 'next/server'

// Define interfaces for our data structures
interface FoodHistoryEntry {
  name: string
  isHealthy: boolean
  points: number
  timestamp: string
  imageUrl?: string
  nutritionalInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
}

interface UserProgress {
  totalPoints: number
  healthyChoices: number
  unhealthyChoices: number
  currentStreak: number
  level: number
}

// In-memory storage (replace with database in production)
const foodHistory: FoodHistoryEntry[] = []
const userProgress: UserProgress = {
  totalPoints: 0,
  healthyChoices: 0,
  unhealthyChoices: 0,
  currentStreak: 0,
  level: 1
}

export async function GET() {
  return NextResponse.json({
    history: foodHistory,
    progress: userProgress
  })
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as FoodHistoryEntry
    
    // Update food history
    foodHistory.unshift({
      ...data,
      timestamp: new Date().toISOString()
    })

    // Update progress
    if (data.isHealthy) {
      userProgress.healthyChoices++
      userProgress.currentStreak++
    } else {
      userProgress.unhealthyChoices++
      userProgress.currentStreak = 0
    }

    userProgress.totalPoints = Math.max(0, userProgress.totalPoints + data.points)
    userProgress.level = Math.floor(userProgress.totalPoints / 100) + 1

    return NextResponse.json({
      success: true,
      history: foodHistory,
      progress: userProgress
    })
  } catch (error) {
    console.error('Error saving food history:', error)
    return NextResponse.json(
      { error: 'Failed to save food history' },
      { status: 500 }
    )
  }
} 