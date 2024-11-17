import { NextResponse } from 'next/server'

// In-memory storage for leaderboard (replace with database in production)
let leaderboard = [
  { name: 'Alice', xp: 1200 },
  { name: 'Bob', xp: 1050 },
  { name: 'Charlie', xp: 980 },
  { name: 'David', xp: 920 },
  { name: 'Eva', xp: 890 },
]

export async function GET() {
  // Sort leaderboard by XP in descending order
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp - a.xp)
  return NextResponse.json({ leaderboard: sortedLeaderboard })
}

export async function POST(request: Request) {
  try {
    const { username, xp } = await request.json()
    
    if (!username || typeof xp !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid username or XP' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUserIndex = leaderboard.findIndex(user => user.name === username)
    
    if (existingUserIndex !== -1) {
      // Update existing user's XP
      leaderboard[existingUserIndex].xp += xp
    } else {
      // Add new user
      leaderboard.push({ name: username, xp })
    }

    // Sort leaderboard
    leaderboard = leaderboard.sort((a, b) => b.xp - a.xp)

    return NextResponse.json({ 
      success: true, 
      message: 'Score added successfully',
      leaderboard: leaderboard.slice(0, 10) // Return top 10
    })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add score' },
      { status: 500 }
    )
  }
} 