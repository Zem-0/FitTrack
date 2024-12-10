'use client'

import { useUserWorkouts } from '@/hooks/useUserWorkouts';

export default function WorkoutPage() {
  const { workouts, loading } = useUserWorkouts();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Workouts</h1>
      <ul>
        {workouts && workouts.map((workout) => (
          <li key={workout.id}>
            {workout.name} - {workout.duration} minutes - {workout.calories} calories
          </li>
        ))}
      </ul>
    </div>
  );
} 