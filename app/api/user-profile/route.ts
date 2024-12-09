import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await req.json()
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userProfile', JSON.stringify({
        ...data,
        userId
      }));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (typeof localStorage !== 'undefined') {
      const profile = localStorage.getItem('userProfile');
      return NextResponse.json(profile ? JSON.parse(profile) : null);
    }

    return NextResponse.json(null);
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 