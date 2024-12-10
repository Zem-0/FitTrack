'use server'

import { prisma } from '@/lib/prisma';

export async function updateProfile(userId: string, profileData: any) {
  try {
    await prisma.userProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error: 'Failed to update profile' };
  }
}
