import { auth, currentUser } from "@clerk/nextjs";
import { prisma } from "./prisma";

export async function ensureUserExists() {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Try to find existing user
  let dbUser = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  // If user doesn't exist, create them
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: userId,
      }
    });
  }

  return dbUser;
} 