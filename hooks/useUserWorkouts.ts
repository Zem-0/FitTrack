'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface Workout {
  id: string;
  name: string;
  duration: number;
  calories: number;
  type: 'cardio' | 'strength';  // Add this line

}

export function useUserWorkouts() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add your workout fetching logic here
    setLoading(false);
  }, [user?.id]);

  return { workouts, loading };
} 