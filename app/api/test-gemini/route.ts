import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    // Log environment variable status (but not the actual key)
    console.log('API Key status:', process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'Present' : 'Missing');

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Simple test prompt
    const result = await model.generateContent('Respond with "OK" if you can read this.');
    const response = await result.response;
    const text = response.text();

    console.log('Gemini test response:', text);

    return Response.json({
      status: 'success',
      working: text.includes('OK'),
      response: text
    });

  } catch (error) {
    console.error('Gemini test error:', error);
    return Response.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
} 