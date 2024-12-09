'use client'

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Utensils, ArrowRight, Trash2, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import AddMealDialog from "@/components/AddMealDialog";
import NutritionProgress from "@/components/NutritionProgress";
import EditMealDialog from "@/components/EditMealDialog";
import { format } from "date-fns";
import { useUserGoals } from "@/hooks/useUserGoals";

interface Meal {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'other';
  date: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export default function FoodTrackerPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  
  // Replace the static dailyGoals with the dynamic ones
  const dailyGoals = useUserGoals();

  // Load meals for selected date
  useEffect(() => {
    const savedMeals = localStorage.getItem('meals');
    if (savedMeals) {
      const allMeals = JSON.parse(savedMeals);
      const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
      const filteredMeals = allMeals.filter((meal: Meal) => meal.date === selectedDateStr);
      setMeals(filteredMeals);
    }
  }, [selectedDate]);

  const handleAddMeal = (meal: Meal) => {
    const newMeal = {
      ...meal,
      date: format(selectedDate, 'yyyy-MM-dd')
    };

    const savedMeals = localStorage.getItem('meals');
    const allMeals = savedMeals ? JSON.parse(savedMeals) : [];
    const updatedMeals = [...allMeals, newMeal];

    localStorage.setItem('meals', JSON.stringify(updatedMeals));
    setMeals(prev => [...prev, newMeal]);
    setIsAddingMeal(false);
    toast.success('Meal added successfully');
  };

  const deleteMeal = (mealId: string) => {
    try {
      const savedMeals = localStorage.getItem('meals');
      if (savedMeals) {
        const allMeals = JSON.parse(savedMeals);
        const updatedAllMeals = allMeals.filter((meal: Meal) => meal.id !== mealId);
        localStorage.setItem('meals', JSON.stringify(updatedAllMeals));
        
        const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
        const updatedCurrentMeals = updatedAllMeals.filter(
          (meal: Meal) => meal.date === selectedDateStr
        );
        setMeals(updatedCurrentMeals);
      }
      toast.success('Meal deleted successfully');
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast.error('Failed to delete meal');
    }
  };

  const updateMeal = (updatedMeal: Meal) => {
    try {
      const savedMeals = localStorage.getItem('meals');
      if (savedMeals) {
        const allMeals = JSON.parse(savedMeals);
        const updatedAllMeals = allMeals.map((meal: Meal) => 
          meal.id === updatedMeal.id ? { ...updatedMeal, date: format(selectedDate, 'yyyy-MM-dd') } : meal
        );
        localStorage.setItem('meals', JSON.stringify(updatedAllMeals));
        
        const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
        const updatedCurrentMeals = updatedAllMeals.filter(
          (meal: Meal) => meal.date === selectedDateStr
        );
        setMeals(updatedCurrentMeals);
      }
      toast.success('Meal updated successfully');
    } catch (error) {
      console.error('Error updating meal:', error);
      toast.error('Failed to update meal');
    }
  };

  // Group meals by type
  const mealsByType = {
    breakfast: meals.filter(meal => meal.type === 'breakfast'),
    lunch: meals.filter(meal => meal.type === 'lunch'),
    dinner: meals.filter(meal => meal.type === 'dinner'),
    other: meals.filter(meal => meal.type === 'other')
  };

  // Calculate totals for each meal type
  const getTotalsForMealType = (meals: Meal[]) => {
    return meals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.nutrients?.calories || 0),
      protein: acc.protein + (meal.nutrients?.protein || 0),
      carbs: acc.carbs + (meal.nutrients?.carbs || 0),
      fats: acc.fats + (meal.nutrients?.fats || 0)
    }), {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    });
  };

  // Calculate totals for the selected date
  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.nutrients?.calories || 0),
    protein: acc.protein + (meal.nutrients?.protein || 0),
    carbs: acc.carbs + (meal.nutrients?.carbs || 0),
    fats: acc.fats + (meal.nutrients?.fats || 0)
  }), {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-white">Food Tracker</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(prev => {
                const newDate = new Date(prev);
                newDate.setDate(prev.getDate() - 1);
                return newDate;
              })}
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="bg-transparent border-none text-white text-center"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(prev => {
                const newDate = new Date(prev);
                newDate.setDate(prev.getDate() + 1);
                return newDate;
              })}
              className="text-white hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => setIsAddingMeal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Meal
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6 bg-[#1c1c1c] border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Today's Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <NutritionProgress
            label="Calories"
            current={Math.round(totals.calories)}
            goal={dailyGoals.calories}
            unit="kcal"
            color="yellow"
          />
          <NutritionProgress
            label="Protein"
            current={Math.round(totals.protein)}
            goal={dailyGoals.protein}
            unit="g"
            color="red"
          />
          <NutritionProgress
            label="Carbs"
            current={Math.round(totals.carbs)}
            goal={dailyGoals.carbs}
            unit="g"
            color="blue"
          />
          <NutritionProgress
            label="Fats"
            current={Math.round(totals.fats)}
            goal={dailyGoals.fats}
            unit="g"
            color="green"
          />
        </div>
      </Card>

      {/* Meals By Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(mealsByType).map(([type, typeMeals]) => {
          const typeTotals = getTotalsForMealType(typeMeals);
          
          return (
            <Card key={type} className="p-6 bg-[#1c1c1c] border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white capitalize">
                  {type}
                </h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-yellow-400">
                    {Math.round(typeTotals.calories)} kcal
                  </span>
                  <span className="text-red-400">
                    {Math.round(typeTotals.protein)}g protein
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {typeMeals.map((meal) => (
                  <Card key={meal.id} className="p-4 bg-white/5 border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">{meal.name}</h3>
                        <p className="text-sm text-gray-400">
                          {meal.quantity} {meal.unit} • {meal.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{meal.nutrients.calories} kcal</span>
                          <span>{meal.nutrients.protein}g protein</span>
                          <span>{meal.nutrients.carbs}g carbs</span>
                          <span>{meal.nutrients.fats}g fats</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="bg-white/5 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                            onClick={() => setEditingMeal(meal)}
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Edit meal</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="bg-white/5 text-red-400 hover:text-red-300 hover:bg-red-600/20"
                            onClick={() => deleteMeal(meal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete meal</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {typeMeals.length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    <p>No meals logged for {type}</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <AddMealDialog 
        open={isAddingMeal} 
        onClose={() => setIsAddingMeal(false)}
        onAdd={handleAddMeal}
      />

      {editingMeal && (
        <EditMealDialog
          open={!!editingMeal}
          onClose={() => setEditingMeal(null)}
          onUpdate={updateMeal}
          meal={editingMeal}
        />
      )}
    </div>
  );
} 