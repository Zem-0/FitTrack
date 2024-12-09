'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Workout {
  id: number;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
}

export default function WorkoutTracker() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const handleAddWorkout = () => {
    if (!exercise || !sets || !reps || !weight) return;

    const newWorkout: Workout = {
      id: Date.now(),
      exercise,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight)
    };

    setWorkouts([...workouts, newWorkout]);
    // Reset form
    setExercise('');
    setSets('');
    setReps('');
    setWeight('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Workout Tracker</h1>
      
      {/* Add Workout Form */}
      <Card className="p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Exercise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Exercise name"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Sets"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <Button onClick={handleAddWorkout}>
            Add Exercise
          </Button>
        </div>
      </Card>

      {/* Workout List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Today's Workout</h2>
        {workouts.length === 0 ? (
          <p className="text-gray-500">No exercises added yet</p>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{workout.exercise}</h3>
                  <p className="text-sm text-gray-600">
                    {workout.sets} sets × {workout.reps} reps @ {workout.weight}kg
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setWorkouts(workouts.filter(w => w.id !== workout.id))}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 