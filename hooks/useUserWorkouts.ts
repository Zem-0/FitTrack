import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export function useUserWorkouts() {
  const { userId } = useAuth();
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!userId) return;

      try {
        const response = await fetch('/api/workouts');
        const data = await response.json();
        
        if (data && !data.error) {
          setWorkouts(data);
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, [userId]);

  return workouts;
} 