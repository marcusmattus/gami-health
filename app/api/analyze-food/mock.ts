import { NextResponse } from 'next/server'

const mockResponses = [
  {
    foodItem: "Fresh Garden Salad",
    calories: 150,
    isHealthy: true,
    fullAnalysis: "A nutritious mix of fresh vegetables including lettuce, tomatoes, cucumbers, and carrots. Rich in vitamins A, C, K, and fiber. An excellent low-calorie choice that supports overall health.",
    xpEarned: 20
  },
  {
    foodItem: "Grilled Chicken Breast",
    calories: 280,
    isHealthy: true,
    fullAnalysis: "Lean protein source rich in essential amino acids. Contains B vitamins and minerals. Excellent choice for muscle maintenance and weight management.",
    xpEarned: 25
  },
  {
    foodItem: "Cheeseburger",
    calories: 550,
    isHealthy: false,
    fullAnalysis: "High in saturated fats and calories. While it provides protein, the processed ingredients and high calorie content make it a less healthy choice. Consider healthier alternatives.",
    xpEarned: -5
  },
  {
    foodItem: "Quinoa Buddha Bowl",
    calories: 420,
    isHealthy: true,
    fullAnalysis: "A balanced meal containing complex carbohydrates, plant-based proteins, and healthy fats. Rich in fiber, vitamins, and minerals. Excellent choice for sustained energy.",
    xpEarned: 30
  }
]

export async function POST(_request: Request) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Randomly select a mock response
  const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
  
  return NextResponse.json({
    success: true,
    structured: mockResponse
  })
} 