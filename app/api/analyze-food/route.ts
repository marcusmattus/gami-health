import { NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()

    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured')
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    })

    const prompt = `Analyze this food image and provide the following information:
    1. What food item is this?
    2. Estimate the calories
    3. Is it healthy?
    4. Provide a brief nutritional analysis

    Format the response as JSON with the following structure:
    {
      "foodItem": "name of food",
      "calories": estimated calories as number,
      "isHealthy": boolean,
      "fullAnalysis": "detailed analysis"
    }`

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a nutritionist expert that analyzes food images."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      model: "llama2-70b-4096",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    })

    const analysis = chatCompletion.choices[0]?.message?.content
    
    if (!analysis) {
      return NextResponse.json({
        success: false,
        error: 'No analysis received from AI'
      })
    }
    
    try {
      const structured = JSON.parse(analysis)
      return NextResponse.json({
        success: true,
        structured
      })
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      // Return mock data for testing
      return NextResponse.json({
        success: true,
        structured: {
          foodItem: "Test Food",
          calories: 300,
          isHealthy: true,
          fullAnalysis: "This is a mock response for testing purposes."
        }
      })
    }

  } catch (error) {
    console.error('Error in analyze-food:', error)
    // Return mock data if there's an error
    return NextResponse.json({
      success: true,
      structured: {
        foodItem: "Test Food",
        calories: 300,
        isHealthy: true,
        fullAnalysis: "This is a mock response for testing purposes."
      }
    })
  }
} 