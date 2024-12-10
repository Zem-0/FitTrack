import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default authMiddleware({
  publicRoutes: ["/"],
  
  afterAuth: async (auth, req) => {
    // Allow public routes and non-authenticated users
    if (!auth.userId) {
      return;
    }

    // Allow access to the onboarding page
    if (req.nextUrl.pathname === '/onboarding') {
      return;
    }

    // Check if trying to access dashboard or other protected routes
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      try {
        const profile = await prisma.userProfile.findUnique({
          where: { userId: auth.userId },
        });

        // If no profile exists, redirect to onboarding
        if (!profile) {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    }
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 