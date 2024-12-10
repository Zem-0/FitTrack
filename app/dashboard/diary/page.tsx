'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Utensils, 
  Brain,
  Clock
} from 'lucide-react';

interface MealLog {
  id: string;
  meal: string;
  time: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    micronutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  aiAnalysis: string;
}

export default function DiaryPage() {
  const [mealInput, setMealInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeMeal = async () => {
    if (!mealInput.trim()) {
      setError('Please enter a meal description');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meal: mealInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze meal');
      }

      // Ensure data has the correct structure with default values
      const newMealLog: MealLog = {
        id: Date.now().toString(),
        meal: mealInput,
        time: new Date().toLocaleTimeString(),
        nutrients: {
          calories: data.nutrients?.calories ?? 0,
          protein: data.nutrients?.protein ?? 0,
          carbs: data.nutrients?.carbs ?? 0,
          fats: data.nutrients?.fats ?? 0,
          micronutrients: data.nutrients?.micronutrients ?? []
        },
        aiAnalysis: data.analysis ?? 'No analysis available'
      };

      setMealLogs(prev => [newMealLog, ...prev]);
      setCurrentAnalysis(data.analysis);
      setMealInput('');
    } catch (error) {
      console.error('Error analyzing meal:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze meal');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Render meal logs with null checks
  const renderNutrientValue = (value: number | undefined) => {
    return value ?? 0;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Input Section */}
      <Card className="p-6 bg-[#1c1c1c] border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Log Your Meal</h2>
        <div className="space-y-4">
          <Textarea
            value={mealInput}
            onChange={(e) => setMealInput(e.target.value)}
            placeholder="Describe your meal in detail..."
            className="min-h-[100px] bg-white/5 border-white/10 text-white"
          />
          <Button
            onClick={analyzeMeal}
            disabled={isAnalyzing}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {isAnalyzing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ marginRight: '0.5rem' }}
              >
                <Brain className="h-5 w-5" />
              </motion.div>
            ) : (
              <>
                <Utensils className="mr-2 h-5 w-5" />
                Analyze Meal
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Meal Logs */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Today's Meals</h3>
        {mealLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 bg-[#1c1c1c] border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-blue-400" />
                  <h4 className="text-white font-medium">{log.meal}</h4>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{log.time}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Calories</div>
                  <div className="text-lg text-white">{renderNutrientValue(log.nutrients?.calories)}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Protein</div>
                  <div className="text-lg text-white">{renderNutrientValue(log.nutrients?.protein)}g</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Carbs</div>
                  <div className="text-lg text-white">{renderNutrientValue(log.nutrients?.carbs)}g</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Fats</div>
                  <div className="text-lg text-white">{renderNutrientValue(log.nutrients?.fats)}g</div>
                </div>
              </div>

              <div className="text-sm text-gray-300">{log.aiAnalysis}</div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 