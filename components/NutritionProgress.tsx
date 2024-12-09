interface NutritionProgressProps {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

export default function NutritionProgress({
  label,
  current,
  goal,
  unit,
  color
}: NutritionProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  
  // Map color strings to Tailwind classes
  const colorClasses = {
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500'
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">
          {current.toFixed(0)}/{goal.toFixed(0)} {unit}
        </span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
} 