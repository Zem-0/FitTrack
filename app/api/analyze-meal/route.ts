import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Plus, Utensils, ArrowRight, Trash2 } from "lucide-react";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { meal, quantity, unit } = await request.json();

    const prompt = `
      You are a nutrition expert. Analyze this meal and provide accurate nutritional information.
      
      Meal: ${meal}
      Quantity: ${quantity} ${unit}

      Provide a JSON response with ONLY these exact fields (numbers should be realistic for the given portion):
      {
        "nutrients": {
          "calories": number,
          "protein": number (in grams),
          "carbs": number (in grams),
          "fats": number (in grams)
        }
      }

      Be precise and realistic with the nutritional values for the specified quantity.
      Return ONLY the JSON, no additional text.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response and parse JSON
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const nutritionData = JSON.parse(cleanedText);

    // Validate the response structure
    if (!nutritionData.nutrients || 
        typeof nutritionData.nutrients.calories !== 'number' ||
        typeof nutritionData.nutrients.protein !== 'number' ||
        typeof nutritionData.nutrients.carbs !== 'number' ||
        typeof nutritionData.nutrients.fats !== 'number') {
      throw new Error('Invalid response structure from AI');
    }

    return NextResponse.json(nutritionData);

  } catch (error) {
    console.error('Error analyzing meal:', error);
    return NextResponse.json(
      { error: 'Failed to analyze meal. Please try again.' }, 
      { status: 500 }
    );
  }
} 