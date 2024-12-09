import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Based on this profile, calculate nutrition data and respond with ONLY a valid JSON object (no markdown, no explanation):
      Height: ${body.height}cm
      Weight: ${body.weight}kg
      Age: ${body.age}
      Gender: ${body.gender}
      Activity: ${body.activity}
      Goal: ${body.goal}

      Required JSON structure:
      {
        "calories": number,
        "macros": {
          "protein": number,
          "carbs": number,
          "fats": number
        },
        "water": number,
        "micronutrients": string[],
        "mealTiming": string[],
        "tips": string[]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the response more safely
    const cleanedText = text.replace(/```json|```/g, '').trim();
    let nutrition;
    try {
      nutrition = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Cleaned Text:', cleanedText);
      return NextResponse.json({ error: 'Invalid nutrition data format' }, { status: 400 });
    }

    // Validate the response structure
    if (!nutrition.calories || !nutrition.macros || !nutrition.water) {
      return NextResponse.json({ error: 'Invalid nutrition data structure' }, { status: 400 });
    }

    return NextResponse.json(nutrition);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 