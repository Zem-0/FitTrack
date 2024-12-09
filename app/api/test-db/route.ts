import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("Testing database connection...");
  
  try {
    // Verify database connection
    await db.$connect();
    console.log("Database connection successful");

    // Test database operations
    const result = await db.$queryRaw`SELECT 1 as test`;
    console.log("Query test result:", result);

    // Try to create a test user
    const testUser = await db.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        clerkId: 'test-clerk-id',
      },
    });
    console.log("Test user created/updated:", testUser);

    return NextResponse.json({ 
      status: 'Success',
      connection: 'Connected',
      test: result,
      user: testUser,
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlStart: process.env.DATABASE_URL?.substring(0, 20) + '...'
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      status: 'Error', 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlStart: process.env.DATABASE_URL?.substring(0, 20) + '...'
      }
    }, { status: 500 });
  }
} 