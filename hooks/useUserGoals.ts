import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export function useUserGoals() {
  const { userId } = useAuth();
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 70
  });

  useEffect(() => {
    const fetchGoals = async () => {
      if (!userId) return;

      try {
        const response = await fetch('/api/goals');
        const data = await response.json();
        
        if (data && !data.error) {
          setGoals(data);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };

    fetchGoals();
  }, [userId]);

  return goals;
} 