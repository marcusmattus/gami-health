'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FoodAnalysis, UserProgress } from '@/types/food'

export default function FoodHistory() {
  const [history, setHistory] = useState<(FoodAnalysis & { progress: UserProgress })[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch('/api/food-history')
      const data = await response.json()
      setHistory(data.history)
    }
    fetchHistory()
  }, [])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Food History</h1>
      <div className="grid gap-4">
        {history.map((entry, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{entry.foodItem}</CardTitle>
              <p className="text-sm text-gray-500">
                {new Date(entry.timestamp).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <p>{entry.description}</p>
              <p className="mt-2">Points earned: {entry.points}</p>
              <p>Level at time: {entry.progress.level}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 