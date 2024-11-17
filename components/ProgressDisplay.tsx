'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { UserProgress } from '@/types/food'

interface ProgressDisplayProps {
  progress: UserProgress;
}

export default function ProgressDisplay({ progress }: ProgressDisplayProps) {
  const experienceToNextLevel = (level: number) => level * 100;
  const currentLevelProgress = progress.totalPoints % experienceToNextLevel(progress.level);
  const progressPercentage = (currentLevelProgress / experienceToNextLevel(progress.level)) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Level {progress.level}</span>
            <span>{currentLevelProgress} / {experienceToNextLevel(progress.level)} XP</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{progress.healthyChoices}</p>
            <p className="text-sm text-gray-500">Healthy Choices</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{progress.currentStreak}</p>
            <p className="text-sm text-gray-500">Day Streak</p>
          </div>
        </div>

        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
          <p className="text-center font-bold">Total Points: {progress.totalPoints}</p>
        </div>
      </CardContent>
    </Card>
  )
}