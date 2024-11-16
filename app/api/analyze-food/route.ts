import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Calculate the calorie intake of this food image and score it on how healthy it is. if healthy make 😊 emoji if not healthy 🤢 emoji. and give some fact on health benefits."
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
      model: "llama-3.2-11b-vision-preview",
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    })

    const result = chatCompletion.choices[0]?.message?.content || ''
    return NextResponse.json({ result })

  } catch (error) {
    console.error('Error analyzing food:', error)
    return NextResponse.json(
      { error: 'Failed to analyze food' },
      { status: 500 }
    )
  }
} 