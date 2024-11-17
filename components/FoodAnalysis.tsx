'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Camera } from 'lucide-react'
import { FoodAnalysis as FoodAnalysisType, UserProgress } from '@/types/food'
import ProgressDisplay from './ProgressDisplay'

export default function FoodAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisType | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<UserProgress>({
    totalPoints: 0,
    healthyChoices: 0,
    unhealthyChoices: 0,
    currentStreak: 0,
    level: 1
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const calculatePoints = (isHealthy: boolean): number => {
    let points = 10; // Base points for logging food
    
    if (isHealthy) {
      points += 20; // Bonus for healthy choice
    } else {
      points -= 5; // Penalty for unhealthy choice
    }
    
    return points;
  }

  const updateProgress = (isHealthy: boolean, points: number) => {
    setProgress(prev => {
      const newTotalPoints = Math.max(0, prev.totalPoints + points);
      const newLevel = Math.floor(newTotalPoints / 100) + 1;
      
      return {
        totalPoints: newTotalPoints,
        healthyChoices: isHealthy ? prev.healthyChoices + 1 : prev.healthyChoices,
        unhealthyChoices: !isHealthy ? prev.unhealthyChoices + 1 : prev.unhealthyChoices,
        currentStreak: isHealthy ? prev.currentStreak + 1 : 0,
        level: newLevel
      }
    })
  }

  const analyzeFood = async () => {
    if (!imageUrl) return

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      })

      const data = await response.json()
      const isHealthy = data.result.includes('😊')
      const points = calculatePoints(isHealthy)
      
      const result = {
        foodItem: 'Detected Food',
        calories: 100,
        isHealthy,
        description: data.result,
        points,
        timestamp: new Date().toISOString()
      }

      setAnalysisResult(result)
      updateProgress(isHealthy, points)

      // Store the analysis results and progress
      await fetch('/api/food-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...result,
          progress
        }),
      })
    } catch (error) {
      console.error('Error analyzing food:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      
      <div className="space-y-4">
        <Button 
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
        >
          <Camera className="mr-2 h-4 w-4" />
          Upload Image
        </Button>

        {imageUrl && (
          <div className="mt-4">
            <img 
              src={imageUrl} 
              alt="Food preview" 
              className="max-w-sm rounded-lg shadow-lg"
            />
          </div>
        )}

        <Button 
          onClick={analyzeFood} 
          disabled={isAnalyzing || !imageUrl}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Food'
          )}
        </Button>
      </div>

      <ProgressDisplay progress={progress} />

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>{analysisResult.foodItem}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analysisResult.calories} calories</p>
            <p className="text-xl mt-2">
              {analysisResult.isHealthy ? (
                <span className="text-green-500">😊 Healthy Choice! (+{analysisResult.points} points)</span>
              ) : (
                <span className="text-red-500">🤢 Unhealthy Choice ({analysisResult.points} points)</span>
              )}
            </p>
            <p className="mt-4 text-gray-600">{analysisResult.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}