'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface FoodAnalysisProps {
  userId: string
}

interface AnalysisResponse {
  result: string
  points: number
  healthScore: number
  nutrition: {
    calories: number | null
    protein: number | null
    carbs: number | null
    fat: number | null
  }
  weightPrediction: {
    prediction: string
    recommendation: string
  }
}

interface BMIData {
  height: number
  weight: number
  age: number
  activityLevel: 'sedentary' | 'moderate' | 'active'
}

export default function FoodAnalysis() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [bmiData, setBmiData] = useState<BMIData>({
    height: 0,
    weight: 0,
    age: 0,
    activityLevel: 'moderate'
  })
  const [showBMIForm, setShowBMIForm] = useState(true)

  const calculateBMI = (height: number, weight: number) => {
    const heightInMeters = height / 100
    return (weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const handleBMISubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowBMIForm(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }
      setImage(file)
      setError(null)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeFood = async () => {
    if (!image) return

    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('bmiData', JSON.stringify(bmiData))

      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze food')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleActivityLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBmiData(prev => ({ ...prev, activityLevel: e.target.value as 'sedentary' | 'moderate' | 'active' }))
  }

  if (showBMIForm) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4">Fitness Profile</h2>
        <form onSubmit={handleBMISubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={bmiData.height || ''}
              onChange={(e) => setBmiData({ ...bmiData, height: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={bmiData.weight || ''}
              onChange={(e) => setBmiData({ ...bmiData, weight: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={bmiData.age || ''}
              onChange={(e) => setBmiData({ ...bmiData, age: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Activity Level</label>
            <select
              className="w-full p-2 border rounded"
              value={bmiData.activityLevel}
              onChange={handleActivityLevelChange}
            >
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="moderate">Moderate (exercise 3-5 times/week)</option>
              <option value="active">Active (daily exercise or intense exercise 3-4 times/week)</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Continue to Food Analysis
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-lg mb-2">Your Fitness Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">BMI</p>
            <p className="font-bold">{calculateBMI(bmiData.height, bmiData.weight)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Activity Level</p>
            <p className="font-bold capitalize">{bmiData.activityLevel}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl mb-4">Food Analysis</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload a photo of your food
          </label>
          <div className="flex flex-col items-center space-y-4">
            <label className="w-full cursor-pointer">
              <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                {preview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={preview}
                      alt="Food preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-1 text-sm text-gray-500">
                      Click to upload an image (max 5MB)
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
            <button
              onClick={analyzeFood}
              disabled={loading || !image}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Food'}
            </button>
          </div>
        </div>
        {analysis && (
          <div className="mt-4 space-y-4">
            {/* Weight Prediction Section */}
            {analysis.weightPrediction && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Weight Impact Prediction</h3>
                <p className="mb-2">{analysis.weightPrediction.prediction}</p>
                <p className="text-sm text-gray-600">{analysis.weightPrediction.recommendation}</p>
              </div>
            )}
            
            {/* Points Earned Banner */}
            <div className="bg-green-100 p-4 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="font-medium text-green-800">Points Earned!</h3>
                <p className="text-sm text-green-600">Based on your meal's health score</p>
              </div>
              <div className="text-2xl font-bold text-green-800">
                +{Math.floor(analysis.healthScore / 10)} pts
              </div>
            </div>

            {/* Health Score */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-blue-800 font-medium">Health Score</span>
                <span className="text-xl font-bold text-blue-800">{analysis.healthScore}/100</span>
              </div>
            </div>

            {/* Nutrition Facts */}
            {analysis.nutrition && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3">Nutrition Facts</h3>
                <div className="space-y-2">
                  {analysis.nutrition.calories && (
                    <div className="flex justify-between border-b pb-2">
                      <span>Calories</span>
                      <span className="font-medium">{analysis.nutrition.calories} kcal</span>
                    </div>
                  )}
                  {analysis.nutrition.protein && (
                    <div className="flex justify-between border-b pb-2">
                      <span>Protein</span>
                      <span className="font-medium">{analysis.nutrition.protein}g</span>
                    </div>
                  )}
                  {analysis.nutrition.carbs && (
                    <div className="flex justify-between border-b pb-2">
                      <span>Carbs</span>
                      <span className="font-medium">{analysis.nutrition.carbs}g</span>
                    </div>
                  )}
                  {analysis.nutrition.fat && (
                    <div className="flex justify-between pb-2">
                      <span>Fat</span>
                      <span className="font-medium">{analysis.nutrition.fat}g</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Detailed Analysis */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Detailed Analysis</h3>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap">{analysis.result}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    
    </div>
  )
}