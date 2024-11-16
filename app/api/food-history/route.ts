// import { NextResponse } from 'next/server'
// import { sql } from '@vercel/postgres'

// export async function POST(request: Request) {
//   try {
//     const { foodName, calories, timestamp } = await request.json()

//     // Insert the food entry into the database
//     await sql`
//       INSERT INTO food_history (food_name, calories, timestamp)
//       VALUES (${foodName}, ${calories}, ${timestamp})
//     `

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error('Error storing food history:', error)
//     return NextResponse.json({ error: 'Failed to store food history' }, { status: 500 })
//   }
// }

// export async function GET() {
//   try {
//     const { rows } = await sql`
//       SELECT * FROM food_history 
//       ORDER BY timestamp DESC
//     `
//     return NextResponse.json(rows)
//   } catch (error) {
//     console.error('Error fetching food history:', error)
//     return NextResponse.json({ error: 'Failed to fetch food history' }, { status: 500 })
//   }
// } 