import { useUserWorkouts } from '@/hooks/useUserWorkouts';

export default function WorkoutPage() {
  const workouts = useUserWorkouts();

  return (
    <div>
      <h1>Your Workouts</h1>
      <ul>
        {workouts.map((workout) => (
          <li key={workout.id}>
            {workout.name} - {workout.duration} minutes - {workout.calories} calories
          </li>
        ))}
      </ul>
    </div>
  );
} 