'use client'

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartPulse, Dumbbell, Plus } from 'lucide-react';

// Define the workout type
interface Workout {
  id?: string;
  name: string;
  duration: string;
  calories: string;
  type: 'cardio' | 'strength';
  // Add other fields as needed
}

export default function WorkoutTrackerPage() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [cardioWorkout, setCardioWorkout] = useState<Workout>({
    name: '',
    duration: '',
    calories: '',
    type: 'cardio'
  });
  const [weightWorkout, setWeightWorkout] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    calories: '',
    type: 'weight'
  });

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user, selectedDate]);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch(`/api/workouts?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleAddCardioWorkout = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: cardioWorkout.name,
          duration: parseInt(cardioWorkout.duration),
          calories: parseInt(cardioWorkout.calories),
          type: 'cardio',
          date: selectedDate
        }),
      });

      if (response.ok) {
        const workout = await response.json();
        setWorkouts([...workouts, workout]);
        setCardioWorkout({ name: '', duration: '', calories: '', type: 'cardio' });
      }
    } catch (error) {
      console.error('Error adding cardio workout:', error);
    }
  };

  const handleAddWeightWorkout = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: weightWorkout.name,
          sets: parseInt(weightWorkout.sets),
          reps: parseInt(weightWorkout.reps),
          weight: parseInt(weightWorkout.weight),
          duration: parseInt(weightWorkout.duration),
          calories: parseInt(weightWorkout.calories),
          type: 'weight',
          date: selectedDate
        }),
      });

      if (response.ok) {
        const workout = await response.json();
        setWorkouts([...workouts, workout]);
        setWeightWorkout({ 
          name: '', 
          sets: '', 
          reps: '', 
          weight: '', 
          duration: '', 
          calories: '', 
          type: 'weight' 
        });
      }
    } catch (error) {
      console.error('Error adding weight workout:', error);
    }
  };

  // Calculate daily totals
  const dailyTotals = workouts.reduce((totals, workout) => {
    totals.calories += workout.calories || 0;
    totals.duration += workout.duration || 0;
    return totals;
  }, { calories: 0, duration: 0 });

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-[800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold bg-slate-900 text-white px-4 py-2 rounded-md shadow-md">
            Workout Tracker
          </h1>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto border-slate-700 bg-slate-800 text-white"
          />
        </div>

        <div className="grid gap-8 mb-8">
          <Card className="p-6 border-slate-700 bg-slate-800/50">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Daily Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-slate-400">Total Duration</span>
                  <span className="text-2xl font-bold">{dailyTotals.duration} min</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-slate-400">Total Calories</span>
                  <span className="text-2xl font-bold">{dailyTotals.calories} kcal</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <Tabs defaultValue="cardio" className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-2 bg-slate-900 rounded-lg">
                  <TabsTrigger value="cardio" className="data-[state=active]:bg-slate-800">
                    <HeartPulse className="mr-2 h-4 w-4" />
                    Cardio
                  </TabsTrigger>
                  <TabsTrigger value="weight" className="data-[state=active]:bg-slate-800">
                    <Dumbbell className="mr-2 h-4 w-4" />
                    Weights
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="cardio" className="p-6 pt-4">
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <Input
                      placeholder="Exercise name (e.g., Running, Swimming)"
                      value={cardioWorkout.name}
                      onChange={(e) => setCardioWorkout({ ...cardioWorkout, name: e.target.value })}
                      className="bg-slate-900"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={cardioWorkout.duration}
                        onChange={(e) => setCardioWorkout({ ...cardioWorkout, duration: e.target.value })}
                        className="bg-slate-900"
                      />
                      <Input
                        type="number"
                        placeholder="Calories burned"
                        value={cardioWorkout.calories}
                        onChange={(e) => setCardioWorkout({ ...cardioWorkout, calories: e.target.value })}
                        className="bg-slate-900"
                      />
                    </div>
                    <Button 
                      onClick={handleAddCardioWorkout} 
                      className="w-full bg-purple-700 hover:bg-purple-800"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Cardio Workout
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="weight" className="p-6 pt-4">
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <Input
                      placeholder="Exercise name (e.g., Bench Press, Squats)"
                      value={weightWorkout.name}
                      onChange={(e) => setWeightWorkout({ ...weightWorkout, name: e.target.value })}
                      className="bg-slate-900"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        type="number"
                        placeholder="Sets"
                        value={weightWorkout.sets}
                        onChange={(e) => setWeightWorkout({ ...weightWorkout, sets: e.target.value })}
                        className="bg-slate-900"
                      />
                      <Input
                        type="number"
                        placeholder="Reps"
                        value={weightWorkout.reps}
                        onChange={(e) => setWeightWorkout({ ...weightWorkout, reps: e.target.value })}
                        className="bg-slate-900"
                      />
                      <Input
                        type="number"
                        placeholder="Weight (kg)"
                        value={weightWorkout.weight}
                        onChange={(e) => setWeightWorkout({ ...weightWorkout, weight: e.target.value })}
                        className="bg-slate-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={weightWorkout.duration}
                        onChange={(e) => setWeightWorkout({ ...weightWorkout, duration: e.target.value })}
                        className="bg-slate-900"
                      />
                      <Input
                        type="number"
                        placeholder="Calories burned"
                        value={weightWorkout.calories}
                        onChange={(e) => setWeightWorkout({ ...weightWorkout, calories: e.target.value })}
                        className="bg-slate-900"
                      />
                    </div>
                    <Button 
                      onClick={handleAddWeightWorkout} 
                      className="w-full bg-blue-700 hover:bg-blue-800"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Weight Training
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-4">
          {workouts.map((workout) => (
            <Card 
              key={workout.id} 
              className={`p-4 border-2 ${
                workout.type === 'cardio' 
                  ? 'border-purple-700 bg-gradient-to-br from-purple-900 to-slate-900' 
                  : 'border-blue-700 bg-gradient-to-br from-blue-900 to-slate-900'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    {workout.type === 'cardio' ? (
                      <HeartPulse className="h-5 w-5 text-purple-300" />
                    ) : (
                      <Dumbbell className="h-5 w-5 text-blue-300" />
                    )}
                    <h3 className="font-semibold text-lg text-white">{workout.name}</h3>
                  </div>
                  {workout.type === 'weight' ? (
                    <p className="text-sm text-gray-300 mt-1">
                      {workout.sets} sets × {workout.reps} reps @ {workout.weight}kg
                    </p>
                  ) : (
                    <p className="text-sm text-gray-300 mt-1">
                      Duration: {workout.duration} minutes
                    </p>
                  )}
                  <p className="text-sm text-gray-300">
                    Calories: {workout.calories}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 