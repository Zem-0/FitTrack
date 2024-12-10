import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';

export async function GET() {
  try {
    const { userId } = await auth();
    console.log('Authenticated userId:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const goals = await prisma.goals.findFirst({
      where: { userId }
    });

    if (!goals) {
      return NextResponse.json({ error: 'Goals not found' }, { status: 404 });
    }

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { profile } = await request.json();

    // Check if goals already exist
    const existingGoals = await prisma.goals.findFirst({
      where: { userId }
    });

    if (existingGoals) {
      return NextResponse.json(existingGoals);
    }

    // Calculate goals only if they don't exist
    const goals = calculateGoals(profile);

    // Create new goals
    const newGoals = await prisma.goals.create({
      data: {
        userId,
        calories: goals.calories,
        protein: goals.protein,
        carbs: goals.carbs,
        fat: goals.fats
      }
    });

    return NextResponse.json(newGoals);
  } catch (error) {
    console.error('Error updating goals:', error);
    return NextResponse.json({ error: 'Failed to update goals' }, { status: 500 });
  }
}

function calculateGoals(profile: any) {
  const { weight, height, age, gender, activityLevel, goal } = profile;

  // BMR calculation
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];

  // Adjust calories based on goal
  let targetCalories = tdee;
  if (goal === 'lose') targetCalories *= 0.8;
  if (goal === 'gain') targetCalories *= 1.2;

  // Calculate macros
  const proteinPerKg = goal === 'gain' ? 2.2 : 2;
  const protein = weight * proteinPerKg;
  const fats = (targetCalories * 0.25) / 9;
  const remainingCalories = targetCalories - (protein * 4) - (fats * 9);
  const carbs = remainingCalories / 4;

  return {
    calories: Math.round(targetCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats)
  };
}