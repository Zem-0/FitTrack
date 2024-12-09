import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { PrismaClient } from '@prisma/client';
import { calculateNutrition } from '@/utils/gemini';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching profile for user:', userId); // Debug log

    // Get user profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      console.log('Profile not found for user:', userId); // Debug log
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    console.log('Found profile:', profile); // Debug log

    // Calculate nutrition requirements
    const nutritionData = await calculateNutrition(profile);
    console.log('Calculated nutrition data:', nutritionData); // Debug log

    return NextResponse.json({ data: nutritionData });

  } catch (error) {
    console.error('Error in nutrition API:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 