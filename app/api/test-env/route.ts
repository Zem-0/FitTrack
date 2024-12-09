import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    database_url_exists: !!process.env.DATABASE_URL,
    database_url_start: process.env.DATABASE_URL?.substring(0, 20) + '...',
    node_env: process.env.NODE_ENV,
    // Add other environment variables you want to check (without exposing sensitive data)
  });
} 