'use server'

import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function updateProfile(userId: string, profileData: any) {
  try {
    await prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData
      }
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, profile: profileData }),
    });

    if (!response.ok) throw new Error('Failed to update goals');
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error: 'Failed to update profile' };
  }
}
