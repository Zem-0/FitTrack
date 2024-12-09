import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const workouts = await prisma.workout.findMany({
      where: { 
        userId: userId.toString(),
        date: {
          gte: date ? new Date(`${date}T00:00:00Z`) : undefined,
          lt: date ? new Date(`${date}T23:59:59Z`) : undefined,
        }
      },
      orderBy: { 
        date: 'desc' 
      }
    });

    return NextResponse.json(workouts);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching workouts:', error.message);
    }
    return NextResponse.json(
      { error: 'Failed to fetch workouts' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log('Received data:', data);

    const workout = await prisma.workout.create({
      data: {
        name: data.name || '',
        duration: Number(data.duration) || 0,
        calories: Number(data.calories) || 0,
        type: data.type,
        sets: data.sets ? Number(data.sets) : null,
        reps: data.reps ? Number(data.reps) : null,
        weight: data.weight ? Number(data.weight) : null,
        date: new Date(data.date),
        user: {
          connect: {
            id: userId.toString()
          }
        }
      }
    });

    return NextResponse.json(workout);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating workout:', error.message);
    }
    return NextResponse.json(
      { error: 'Failed to create workout' }, 
      { status: 500 }
    );
  }
} 