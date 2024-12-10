'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Utensils, 
  Brain,
  Clock,
  Apple,
  Scale,
} from 'lucide-react';

interface FoodLog {
  id: string;
  food: string;
  time: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    micronutrients: {
      name: string;
      amount: number;
      unit: string;
    }[];
  };
  aiAnalysis: string;
}

export default function FoodTrackingPage() {
  const [foodInput, setFoodInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeFood = async () => {
    if (!foodInput.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ food: foodInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze food');
      }

      const data = await response.json();
      
      if (!data.nutrients || !data.analysis) {
        throw new Error('Invalid response format');
      }

      const newFoodLog: FoodLog = {
        id: Date.now().toString(),
        food: foodInput,
        time: new Date().toLocaleTimeString(),
        nutrients: {
          calories: data.nutrients.calories || 0,
          protein: data.nutrients.protein || 0,
          carbs: data.nutrients.carbs || 0,
          fats: data.nutrients.fats || 0,
          micronutrients: data.nutrients.micronutrients || []
        },
        aiAnalysis: data.analysis
      };

      setFoodLogs([newFoodLog, ...foodLogs]);
      setCurrentAnalysis(data.analysis);
      setFoodInput('');
    } catch (error) {
      console.error('Error analyzing food:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze food');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Food Input Section */}
      <Card className={`p-6 bg-[#1c1c1c] border-white/10 ${cardStyle}`}>
        <h2 className="text-xl font-semibold text-white mb-4">Track Your Food</h2>
        <div className="space-y-4">
          <Textarea
            value={foodInput}
            onChange={(e) => setFoodInput(e.target.value)}
            placeholder="Describe your food in detail (e.g., '2 eggs, 2 slices of whole wheat bread, 1 avocado')"
            className="min-h-[100px] bg-white/5 border-white/10 text-white"
          />
          <Button
            onClick={analyzeFood}
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
                <Apple className="mr-2 h-5 w-5" />
                Analyze Food
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

      {/* Current Analysis */}
      {currentAnalysis && !error && (
        <Card className="p-6 bg-[#1c1c1c] border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">AI Analysis</h3>
            <Scale className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-gray-300">{currentAnalysis}</p>
        </Card>
      )}

      {/* Food Logs */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Today's Food Log</h3>
        {foodLogs.length === 0 ? (
          <Card className="p-6 bg-[#1c1c1c] border-white/10">
            <p className="text-gray-400 text-center">No food logged yet today. Start by adding your first meal!</p>
          </Card>
        ) : (
          foodLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 bg-[#1c1c1c] border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-blue-400" />
                    <h4 className="text-white font-medium">{log.food}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{log.time}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  {Object.entries({
                    Calories: log.nutrients.calories,
                    Protein: `${log.nutrients.protein}g`,
                    Carbs: `${log.nutrients.carbs}g`,
                    Fats: `${log.nutrients.fats}g`
                  }).map(([label, value]) => (
                    <div key={label} className="bg-white/5 p-3 rounded-lg">
                      <div className="text-sm text-gray-400">{label}</div>
                      <div className="text-lg text-white">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-gray-300">{log.aiAnalysis}</div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
} 