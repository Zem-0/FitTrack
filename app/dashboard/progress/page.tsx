'use client'
import { motion } from 'framer-motion'

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <motion.h1 
        className="text-3xl font-bold text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Progress Tracking
      </motion.h1>
      
      <motion.div
        className="grid gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Progress</h2>
          <p className="text-gray-400">Coming soon: View your fitness progress and achievements.</p>
        </div>
      </motion.div>
    </div>
  )
} 