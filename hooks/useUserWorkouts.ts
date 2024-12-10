'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export function useUserWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const response = await fetch('/api/workouts');
        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchWorkouts();
    }
  }, [userId]);

  return { workouts, loading };
} 