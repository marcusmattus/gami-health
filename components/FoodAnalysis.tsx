'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Camera } from 'lucide-react'

type AnalysisResult = {
  foodItem: string
  calories: number
  isHealthy: boolean
  description: string
}

export default function FoodAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      
      // Parse the AI response to extract relevant information
      // This is a simple example - you might need to adjust based on the AI's response format
      const result = {
        foodItem: 'Detected Food',
        calories: 100,
        isHealthy: data.result.includes('😊'),
        description: data.result
      }

      setAnalysisResult(result)

      // Store the analysis results
      await fetch('/api/food-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodName: data.foodName,
          calories: data.calories,
          timestamp: new Date().toISOString(),
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

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>{analysisResult.foodItem}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analysisResult.calories} calories</p>
            <p className="text-xl mt-2">
              {analysisResult.isHealthy ? (
                <span className="text-green-500">😊 Healthy Choice!</span>
              ) : (
                <span className="text-red-500">🤢 Unhealthy Choice</span>
              )}
            </p>
            <p className="mt-4 text-gray-600">{analysisResult.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}