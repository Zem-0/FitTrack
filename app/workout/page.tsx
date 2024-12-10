'use client'



import { useUserWorkouts } from '@/hooks/useUserWorkouts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Dumbbell } from 'lucide-react';
import Link from 'next/link';

export default function WorkoutPage() {
  const { workouts, loading } = useUserWorkouts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-blue-500/10">
            <Dumbbell className="h-6 w-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Your Workouts</h1>
        </div>
        <Button 
          asChild
          className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          <Link href="/workout/new">
            <Plus className="w-5 h-5 mr-2" />
            New Workout
          </Link>
        </Button>
      </div>

      {workouts?.length === 0 ? (
        <Card className="p-8 text-center bg-slate-800/50 border-slate-700">
          <p className="text-gray-400 mb-4">No workouts found. Start by creating your first workout!</p>
          <Button 
            asChild
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/workout/new">Create Workout</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts?.map((workout) => (
            <Card 
              key={workout.id}
              className="p-6 bg-slate-800/50 border-slate-700 transition-all duration-300 hover:border-blue-500/50 hover:translate-y-[-2px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">{workout.name}</h3>
                <div className="p-2 rounded-md bg-blue-500/10">
                  <Dumbbell className="h-4 w-4 text-blue-400" />
                </div>
              </div>
              <div className="space-y-2 text-gray-400">
                <p>Duration: {workout.duration} minutes</p>
                <p>Calories: {workout.calories} kcal</p>
                <p>Type: {workout.type}</p>
              </div>
              <Button 
                asChild
                variant="ghost" 
                className="w-full mt-4 hover:bg-blue-500/10 transition-all duration-300"
              >
                <Link href={`/workout/${workout.id}`}>View Details</Link>
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 