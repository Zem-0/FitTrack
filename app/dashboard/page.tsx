'use client'
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserGoals } from "@/hooks/useUserGoals";

import {
  Activity,
  Check,
  Cookie,
  Croissant,
  Droplets,
  Dumbbell,
  Flame,
  Plus,
  Target,
  Trash2
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UserProfile {
  height: number;
  weight: number;
  age: number;
  gender: string;
  activity: string;
  goal: string;
}

interface NutritionData {
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  water: number;
  micronutrients: {
    name: string;
    current: number;
    target: number;
    unit: string;
  }[];
  mealTiming: string[];
  tips: string[];
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  isNutritionTask?: boolean;
}

const cardStyle = `
  p-6 bg-[#1c1c1c] border-white/10 h-full 
  transition-all duration-300
  hover:bg-gradient-to-br hover:from-[#1c1c1c] hover:to-[#252525]
  hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10
  relative overflow-hidden
  before:absolute before:inset-0 
  before:bg-gradient-to-r before:from-transparent 
  before:via-white/5 before:to-transparent
  before:translate-x-[-200%]
  hover:before:translate-x-[200%]
  before:transition-transform before:duration-1000
  cursor-pointer
`;

export default function DashboardPage() {
  const dailyGoals = useUserGoals();
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = localStorage.getItem('userProfile');
        if (!savedProfile) {
          setError('Please complete your profile first');
          setLoading(false);
          return;
        }

        const profile = JSON.parse(savedProfile);
        const response = await fetch('/api/calculate-nutrition', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profile),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch nutrition data');
        }

        const data = await response.json();
        setNutritionData(data);

        // Update todos with nutrition tasks
        const nutritionTasks = [
          {
            id: 'water',
            text: `Drink ${data.water}L of water today`,
            completed: false,
            isNutritionTask: true
          },
          {
            id: 'calories',
            text: `Consume ${data.calories} calories today`,
            completed: false,
            isNutritionTask: true
          },
          {
            id: 'protein',
            text: `Get ${data.macros.protein}g of protein today`,
            completed: false,
            isNutritionTask: true
          }
        ];
        setTodos(nutritionTasks);
        
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load nutrition data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);
    // Chart data setup
  const chartData = {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [{
      data: nutritionData ? [
        nutritionData.macros.protein,
        nutritionData.macros.carbs,
        nutritionData.macros.fats
      ] : [0, 0, 0],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(255, 99, 132, 0.8)',
      ],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  const microChartData = {
    labels: nutritionData?.micronutrients || [],
    datasets: [
      {
        label: 'Current Intake',
        data: nutritionData?.micronutrients.map(() => Math.floor(Math.random() * 100)) || [], // Replace with actual data
        backgroundColor: 'rgba(147, 51, 234, 0.8)', // Purple
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
      {
        label: 'Daily Target',
        data: nutritionData?.micronutrients.map(() => 100) || [], // Replace with actual targets
        backgroundColor: 'rgba(59, 130, 246, 0.3)', // Light blue
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
      },
    ],
  };

  const microChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
          font: { size: 12 },
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false
    };
    
    setTodos(prev => [...prev, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 bg-[#1c1c1c] border-white/10">
          <h3 className="text-xl font-medium text-red-400 mb-2">Error</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.href = '/profile'}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Complete Profile
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <div className="space-y-8">
          {/* First Row - Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Calories Card */}
            <div className="h-full">
              <Card className={cardStyle}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Calories</h3>
                  <Flame className="h-5 w-5 text-orange-400" />
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-white">{nutritionData?.calories}</div>
                  <p className="text-sm text-gray-400">daily target</p>
                </div>
              </Card>
            </div>

            {/* Protein Card */}
            <div className="h-full">
              <Card className={cardStyle}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Protein</h3>
                  <Dumbbell className="h-5 w-5 text-blue-400" />
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-white">{nutritionData?.macros.protein}g</div>
                  <p className="text-sm text-gray-400">daily target</p>
                </div>
              </Card>
            </div>

            {/* Carbs Card */}
            <div className="h-full">
              <Card className={cardStyle}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Carbs</h3>
                  <Croissant className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-white">{nutritionData?.macros.carbs}g</div>
                  <p className="text-sm text-gray-400">daily target</p>
                </div>
              </Card>
            </div>

            {/* Fats Card */}
            <div className="h-full">
              <Card className={cardStyle}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Fats</h3>
                  <Droplets className="h-5 w-5 text-red-400" />
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-white">{nutritionData?.macros.fats}g</div>
                  <p className="text-sm text-gray-400">daily target</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Second Row - Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Macros Distribution */}
            <div className="h-full">
              <Card className={cardStyle}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-white">Macros Distribution</h3>
                  <Cookie className="h-5 w-5 text-orange-400" />
                </div>
                <div className="h-[300px] flex items-center justify-center">
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
              </Card>
            </div>

            {/* Micronutrients */}
            <div className="h-full">
              <Card className="p-6 bg-[#1c1c1c] border-white/10 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-white">Micronutrients</h3>
                  <Target className="h-5 w-5 text-purple-400" />
                </div>
                
                {/* Chart Container */}
                <div className="h-[300px] mb-4">
                  <Bar data={microChartData} options={microChartOptions} />
                </div>
                
                {/* Micronutrient Pills */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
                  {nutritionData?.micronutrients.map((nutrient, index) => (
                    <div
                      key={index}
                      className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-300">{nutrient.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Third Row - Todo List */}
          <div className="h-full">
            <Card className={cardStyle}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Daily Tasks</h3>
                <Activity className="h-5 w-5 text-blue-400" />
              </div>

              <div className="flex gap-2 mb-6">
                <Input
                  type="text"
                  placeholder="Add a new task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button
                  onClick={addTodo}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
                    todo.completed
                      ? 'bg-green-500/10 line-through text-gray-400'
                      : 'bg-white/5 text-gray-200'
                  } ${todo.isNutritionTask ? 'border-l-2 border-blue-500' : ''}`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-400'
                    } flex items-center justify-center`}
                  >
                    {todo.completed && <Check className="h-3 w-3 text-white" />}
                  </button>

                  <span className="flex-grow">{todo.text}</span>

                  {!todo.isNutritionTask && (
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}