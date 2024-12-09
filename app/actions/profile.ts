'use server'

import { revalidatePath } from "next/cache";

export type ProfileData = {
  height: number;
  weight: number;
  age: number;
  gender: string;
  activity: string;
  goal: string;
};

export async function getProfile() {
  return null;
}

export async function updateProfile(formData: ProfileData) {
  try {
    // Validate the data
    const data = {
      height: Number(formData.height),
      weight: Number(formData.weight),
      age: Number(formData.age),
      gender: String(formData.gender),
      activity: String(formData.activity),
      goal: String(formData.goal)
    };

    // Validate numbers
    if (isNaN(data.height) || isNaN(data.weight) || isNaN(data.age)) {
      throw new Error("Invalid numeric values");
    }

    // Validate strings
    if (!data.gender || !data.activity || !data.goal) {
      throw new Error("Missing required fields");
    }

    revalidatePath('/profile');
    revalidatePath('/dashboard');
    
    return data;
  } catch (error) {
    console.error("Profile update error:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to update profile");
  }
} 