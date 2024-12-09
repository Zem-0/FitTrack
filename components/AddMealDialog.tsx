'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'other';

interface AddMealDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (meal: any) => void;
}

export default function AddMealDialog({ open, onClose, onAdd }: AddMealDialogProps) {
  const [loading, setLoading] = useState(false);
  const [mealInput, setMealInput] = useState({
    name: '',
    quantity: '',
    unit: 'grams',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'breakfast' as MealType
  });

  const analyzeMeal = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meal: mealInput.name,
          quantity: Number(mealInput.quantity),
          unit: mealInput.unit
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze meal');
      }

      const data = await response.json();
      
      onAdd({
        id: Date.now().toString(),
        ...mealInput,
        nutrients: data.nutrients
      });

      setMealInput({
        name: '',
        quantity: '',
        unit: 'grams',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'breakfast'
      });
    } catch (error) {
      console.error('Error analyzing meal:', error);
      toast.error('Failed to analyze meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1c1c1c] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Add Meal</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Meal Name</Label>
            <Input
              placeholder="e.g., Grilled Chicken Breast"
              value={mealInput.name}
              onChange={(e) => setMealInput({ ...mealInput, name: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Meal Type</Label>
            <select
              value={mealInput.type}
              onChange={(e) => setMealInput({ ...mealInput, type: e.target.value as MealType })}
              className="w-full h-10 rounded-md border border-white/10 text-white px-3"
              style={{ backgroundColor: '#1c1c1c' }}
            >
              <option value="breakfast" style={{ backgroundColor: '#1c1c1c' }}>Breakfast</option>
              <option value="lunch" style={{ backgroundColor: '#1c1c1c' }}>Lunch</option>
              <option value="dinner" style={{ backgroundColor: '#1c1c1c' }}>Dinner</option>
              <option value="other" style={{ backgroundColor: '#1c1c1c' }}>Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-400">Quantity</Label>
              <Input
                type="number"
                placeholder="100"
                value={mealInput.quantity}
                onChange={(e) => setMealInput({ ...mealInput, quantity: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-400">Unit</Label>
              <select
                value={mealInput.unit}
                onChange={(e) => setMealInput({ ...mealInput, unit: e.target.value })}
                className="w-full h-10 rounded-md border border-white/10 text-white px-3"
                style={{ backgroundColor: '#1c1c1c' }}
              >
                <option value="grams" style={{ backgroundColor: '#1c1c1c' }}>grams</option>
                <option value="ml" style={{ backgroundColor: '#1c1c1c' }}>ml</option>
                <option value="pieces" style={{ backgroundColor: '#1c1c1c' }}>pieces</option>
                <option value="servings" style={{ backgroundColor: '#1c1c1c' }}>servings</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Time</Label>
            <Input
              type="time"
              value={mealInput.time}
              onChange={(e) => setMealInput({ ...mealInput, time: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-white/5 text-white hover:bg-white/10 border-white/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={analyzeMeal}
            disabled={loading || !mealInput.name || !mealInput.quantity}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Add Meal'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 