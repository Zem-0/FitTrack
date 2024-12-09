'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

const formSchema = z.object({
  height: z.number().min(100).max(300),
  weight: z.number().min(30).max(300),
  age: z.number().min(13).max(100),
  gender: z.enum(["male", "female", "other"]),
  goal: z.enum(["lose_weight", "gain_muscle", "maintain"]),
  activity: z.enum(["sedentary", "moderate", "active"]),
})

export default function OnboardingForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: 170,
      weight: 70,
      age: 25,
      gender: "male",
      goal: "maintain",
      activity: "moderate",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      localStorage.setItem('userProfile', JSON.stringify(values));
      
      router.push('/dashboard');
      toast.success('Profile created successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4">
      <motion.div 
        className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-lg border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
          <p className="mt-2 text-gray-400">Help us personalize your experience</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Height (cm)</label>
              <input
                type="number"
                {...form.register("height", { valueAsNumber: true })}
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white border border-white/20 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Weight (kg)</label>
              <input
                type="number"
                {...form.register("weight", { valueAsNumber: true })}
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white border border-white/20 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Age</label>
              <input
                type="number"
                {...form.register("age", { valueAsNumber: true })}
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white border border-white/20 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Gender</label>
              <select
                {...form.register("gender")}
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white border border-white/20 focus:border-blue-500 focus:outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Fitness Goal</label>
            <select
              {...form.register("goal")}
              className="w-full rounded-lg bg-white/10 px-4 py-2 text-white border border-white/20 focus:border-blue-500 focus:outline-none"
            >
              <option value="lose_weight">Lose Weight</option>
              <option value="gain_muscle">Gain Muscle</option>
              <option value="maintain">Maintain Weight</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Activity Level</label>
            <select
              {...form.register("activity")}
              className="w-full rounded-lg bg-white/10 px-4 py-2 text-white border border-white/20 focus:border-blue-500 focus:outline-none"
            >
              <option value="sedentary">Sedentary (Office Job)</option>
              <option value="moderate">Moderate (Light Exercise)</option>
              <option value="active">Active (Regular Exercise)</option>
            </select>
          </div>

          <motion.button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Complete Profile
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
} 