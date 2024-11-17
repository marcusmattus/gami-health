'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface LeaderboardUser {
  id: string
  name: string
  points: number
  imageUrl?: string
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      setUsers(data)
    }

    fetchLeaderboard()
    // Refresh every 5 minutes
    const interval = setInterval(fetchLeaderboard, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 rounded-lg bg-secondary"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold w-8">{index + 1}</span>
                <Avatar>
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.name}</span>
              </div>
              <span className="font-bold text-primary">{user.points} pts</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 