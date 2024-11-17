'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, CameraOff, Loader2 } from 'lucide-react'
import type { FoodAnalysis as FoodAnalysisType } from '@/types/food'
import Image from 'next/image'

interface Props {
  onAnalysis?: (result: FoodAnalysisType) => void;
}

export default function CameraCapture({ onAnalysis }: Props) {
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisType | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraOn(true)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      setIsCameraOn(false)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg')
        setCapturedImage(imageDataUrl)
        stopCamera()
      }
    }
  }

  const analyzeImage = async () => {
    if (!capturedImage) return

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: capturedImage }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()
      const isHealthy = data.result.includes('😊')
      
      const result: FoodAnalysisType = {
        foodItem: 'Captured Food',
        calories: data.calories || 0,
        isHealthy,
        description: data.result,
        points: isHealthy ? 30 : -5,
        timestamp: new Date().toISOString()
      }

      setAnalysisResult(result)

      // Call the onAnalysis callback if provided
      if (onAnalysis) {
        onAnalysis(result)
      }

      // Store the analysis in food history
      await fetch('/api/food-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      })

    } catch (error) {
      console.error('Error analyzing image:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video">
        {isCameraOn ? (
          <video ref={videoRef} autoPlay className="w-full h-full object-cover rounded-lg" />
        ) : capturedImage ? (
          <Image 
            src={capturedImage} 
            alt="Captured food" 
            width={640}
            height={480}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
            <CameraOff className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" width={640} height={480} />
      
      <div className="flex justify-center space-x-2">
        {!isCameraOn && !capturedImage && (
          <Button onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" /> Start Camera
          </Button>
        )}
        {isCameraOn && (
          <>
            <Button onClick={captureImage}>Capture</Button>
            <Button variant="secondary" onClick={stopCamera}>Stop Camera</Button>
          </>
        )}
        {capturedImage && (
          <div className="space-x-2">
            <Button 
              onClick={analyzeImage} 
              disabled={isAnalyzing}
              variant="default"
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
            <Button 
              onClick={() => {
                setCapturedImage(null)
                setAnalysisResult(null)
                startCamera()
              }}
              variant="secondary"
            >
              Retake
            </Button>
          </div>
        )}
      </div>

      {analysisResult && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-xl font-semibold">
                {analysisResult.isHealthy ? '😊 Healthy Choice!' : '🤢 Unhealthy Choice'}
              </p>
              <p className="text-sm text-gray-600">{analysisResult.description}</p>
              <p className="text-sm font-medium">
                Points: <span className={analysisResult.isHealthy ? 'text-green-600' : 'text-red-600'}>
                  {analysisResult.points > 0 ? `+${analysisResult.points}` : analysisResult.points}
                </span>
              </p>
              {analysisResult.calories > 0 && (
                <p className="text-sm font-medium">
                  Estimated Calories: {analysisResult.calories}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}