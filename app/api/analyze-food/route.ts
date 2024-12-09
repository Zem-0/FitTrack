import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { food } = await request.json();

    const prompt = `
      Analyze this food: "${food}"
      
      Please provide:
      1. Total calories
      2. Macronutrients (protein, carbs, fats in grams)
      3. Key micronutrients
      4. Brief nutritional analysis
      5. How it compares to daily recommended values
      
      Format the response as JSON with these keys:
      {
        "nutrients": {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fats": number,
          "micronutrients": [{ "name": string, "amount": number, "unit": string }]
        },
        "analysis": string
      }
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const analysis = JSON.parse(text);

    return Response.json(analysis);
  } catch (error) {
    console.error('Error analyzing food:', error);
    return Response.json({ error: 'Failed to analyze food' }, { status: 500 });
  }
} 