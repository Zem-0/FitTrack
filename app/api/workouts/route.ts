import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';
import { ensureUserExists } from '@/lib/prisma-middleware';

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure user exists before querying workouts
    await ensureUserExists();

    let date;
    if (dateStr) {
      date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
    }

    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        date: date ? {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        } : undefined,
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure user exists before creating workout
    await ensureUserExists();

    const body = await request.json();

    // Format the date correctly
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }

    const workout = await prisma.workout.create({
      data: {
        name: body.name,
        type: body.type,
        duration: parseInt(body.duration),
        calories: parseInt(body.calories),
        sets: body.sets ? parseInt(body.sets) : null,
        reps: body.reps ? parseInt(body.reps) : null,
        weight: body.weight ? parseFloat(body.weight) : null,
        date: date,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });

    return NextResponse.json(workout);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating workout:', error.message);
    } else {
      console.error('Error creating workout:', error);
    }
    
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
} 