'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FoodAnalysis } from '@/types/food'
import ProgressDisplay from '@/components/ProgressDisplay'

export default function FoodHistory() {
  const [history, setHistory] = useState<FoodAnalysis[]>([])
  const [progress, setProgress] = useState({
    totalPoints: 0,
    healthyChoices: 0,
    unhealthyChoices: 0,
    currentStreak: 0,
    level: 1
  })

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch('/api/food-history')
      const data = await response.json()
      setHistory(data.history)
      setProgress(data.progress)
    }
    fetchHistory()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-8">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Food History
        </p>
      </div>

      <ProgressDisplay progress={progress} />

      <Card className="w-full max-w-5xl mt-8">
        <CardHeader>
          <CardTitle>Your Food History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{item.foodItem}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${item.isHealthy ? 'text-green-500' : 'text-red-500'}`}>
                      {item.points > 0 ? `+${item.points}` : item.points} points
                    </p>
                    <p className="text-sm">{item.calories} calories</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
} 