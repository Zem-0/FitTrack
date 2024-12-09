import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are an expert fitness trainer and nutritionist with years of experience. 
Your role is to provide accurate, helpful, and motivating advice about:
- Workout routines and exercises
- Proper form and technique
- Nutrition and diet
- Weight loss and muscle gain
- Recovery and injury prevention
- General fitness and health

Keep your responses concise, practical, and evidence-based. Be encouraging and supportive, 
but maintain professionalism. If you're unsure about something, especially regarding medical 
conditions, advise consulting a healthcare professional.`;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { message } = await request.json();

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Combine system prompt with user message
    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 