import { GoogleGenerativeAI } from "@google/generative-ai";

// Check if API key exists and log its status (but not the key itself)
if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  console.error('NEXT_PUBLIC_GEMINI_API_KEY is not defined');
} else {
  console.log('Gemini API key is configured');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
// Add this test function to utils/gemini.ts
export async function testGeminiConnection() {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Respond with 'OK' if you can read this.");
      const response = await result.response;
      const text = response.text();
      console.log('Gemini test response:', text);
      return text.includes('OK');
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }
export async function calculateNutrition(userProfile: any) {
  console.log('Starting nutrition calculation...'); // Debug log

  // Validate user profile
  if (!userProfile.height || !userProfile.weight || !userProfile.age) {
    console.error('Invalid user profile:', userProfile);
    throw new Error('Invalid user profile data');
  }

  const prompt = `
    You are a professional nutritionist. Calculate precise daily nutritional requirements for this person.
    Do not use default values. Calculate everything based on the provided metrics:

    Profile Metrics:
    - Height: ${userProfile.height}cm
    - Weight: ${userProfile.weight}kg
    - Age: ${userProfile.age}
    - Gender: ${userProfile.gender}
    - Activity Level: ${userProfile.activity}
    - Goal: ${userProfile.goal}

    Steps to follow:
    1. Calculate BMR using Mifflin-St Jeor equation:
       - Men: (10 × weight) + (6.25 × height) - (5 × age) + 5
       - Women: (10 × weight) + (6.25 × height) - (5 × age) - 161

    2. Apply activity multiplier:
       - Sedentary: BMR × 1.2
       - Light: BMR × 1.375
       - Moderate: BMR × 1.55
       - Active: BMR × 1.725
       - Very Active: BMR × 1.9

    3. Adjust for goal:
       - Weight Loss: -20% calories
       - Maintenance: no change
       - Muscle Gain: +10% calories

    Respond with calculated JSON only:
    {
      "calories": <calculated_value>,
      "macros": {
        "protein": <calculated_value>,
        "carbs": <calculated_value>,
        "fats": <calculated_value>
      },
      "water": <calculated_value>,
      "micronutrients": [
        <specific recommendations>
      ],
      "mealTiming": [
        <specific timings>
      ],
      "tips": [
        <personalized tips>
      ]
    }
  `;

  try {
    console.log('Sending request to Gemini...'); // Debug log
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.1, // Lower temperature for more consistent calculations
        topK: 1,
        topP: 0.1,
      }
    });

    console.log('Awaiting Gemini response...'); // Debug log
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text); // Debug log
    
    try {
      const parsedData = JSON.parse(text);
      
      // Validate the response has actual calculated values
      if (parsedData.calories === 2000 || 
          parsedData.macros.protein === 150 || 
          parsedData.macros.carbs === 200 || 
          parsedData.macros.fats === 70) {
        console.warn('Detected potential default values in response');
      }

      console.log('Parsed nutrition data:', parsedData); // Debug log
      return parsedData;

    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Raw text that failed to parse:', text);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error in calculateNutrition:', error);
    throw error;
  }
} 