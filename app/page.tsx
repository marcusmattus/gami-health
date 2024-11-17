'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Camera, Trophy, Star, Plus, Loader2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

// Mock data for leaderboard (will be replaced with real data)
const leaderboardData = [
  { name: 'Alice', xp: 1200 },
  { name: 'Bob', xp: 1050 },
  { name: 'Charlie', xp: 980 },
  { name: 'David', xp: 920 },
  { name: 'Eva', xp: 890 },
]

// Update the type definition for analysisResult
interface AnalysisResult {
  foodItem: string;
  calories: number;
  isHealthy: boolean;
  fullAnalysis: string;
  xpEarned?: number;
}

export default function Home() {
  const { toast } = useToast()
  const [userXP, setUserXP] = useState(0)
  const [username, setUsername] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isAddingScore, setIsAddingScore] = useState(false)
  const [leaderboard, setLeaderboard] = useState(leaderboardData)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file"
      })
      return
    }

    // Validate file size (e.g., 5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB"
      })
      return
    }

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImageUrl(base64String)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast({
        title: "Error uploading image",
        description: "Please try again"
      })
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze food')
      }

      const { structured } = data
      
      setAnalysisResult(structured)
      setUserXP(prev => prev + (structured.isHealthy ? 20 : -5))

      toast({
        title: "Analysis Complete",
        description: `${structured.isHealthy ? '😊 Healthy choice!' : '🤢 Try something healthier next time'}`
      })

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error analyzing food:', errorMessage);
      toast({
        title: "Error",
        description: "Failed to analyze food. Please try again."
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const handleAddScore = async () => {
    if (!username || isAddingScore) return

    setIsAddingScore(true)
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, xp: userXP }),
      })

      if (!response.ok) {
        throw new Error('Failed to add score')
      }

      const data = await response.json()
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard)
      }

      toast({
        title: "Success!",
        description: "Your score has been added to the leaderboard"
      })

      setUsername('')
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error adding score:', errorMessage);
      toast({
        title: "Error",
        description: "Failed to add score to leaderboard"
      })
    } finally {
      setIsAddingScore(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Food Detection and Tracking App</h1>
      </div>

      <Tabs defaultValue="food" className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="food">Food Analysis</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="food">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Your Food</CardTitle>
            </CardHeader>
            <CardContent>
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
                  className="w-full"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Upload Food Image
                </Button>

                {imageUrl && (
                  <div className="mt-4">
                    <Image 
                      src={imageUrl} 
                      alt="Food preview" 
                      width={640}
                      height={480}
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                )}

                <Button 
                  onClick={analyzeFood} 
                  disabled={isAnalyzing || !imageUrl}
                  className="w-full"
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

                {analysisResult && (
                  <div className="mt-4 p-4 bg-secondary rounded-lg">
                    <h3 className="font-bold text-lg">{analysisResult.foodItem}</h3>
                    <p className="text-2xl font-bold">{analysisResult.calories} calories</p>
                    <p className="text-xl mt-2">
                      {analysisResult.isHealthy ? (
                        <span className="text-green-500">😊 Healthy Choice! (+20 XP)</span>
                      ) : (
                        <span className="text-red-500">🤢 Unhealthy Choice (-5 XP)</span>
                      )}
                    </p>
                    <p className="mt-4 text-gray-600">{analysisResult.fullAnalysis}</p>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-2xl font-bold">Your XP: {userXP}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div key={user.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Trophy className="w-6 h-6 text-yellow-500" />}
                      {index === 1 && <Trophy className="w-6 h-6 text-gray-400" />}
                      {index === 2 && <Trophy className="w-6 h-6 text-amber-600" />}
                      <span className="font-semibold">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{user.xp} XP</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Label htmlFor="username">Add Your Score</Label>
                <div className="flex mt-2">
                  <Input
                    id="username"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Button 
                    className="ml-2" 
                    onClick={handleAddScore}
                    disabled={!username || isAddingScore}
                  >
                    {isAddingScore ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Add to Leaderboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
