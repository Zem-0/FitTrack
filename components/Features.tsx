'use client'
import { motion } from 'framer-motion'
import { 
  Dumbbell,
  Heart,
  Trophy,
  Calendar,
  LineChart,
  Users,
} from 'lucide-react'

const features = [
  {
    icon: Dumbbell,
    title: "Workout Library",
    description: "Access hundreds of pre-built workouts or create your own custom routines.",
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: Heart,
    title: "Health Tracking",
    description: "Monitor vital health metrics and see your progress over time.",
    color: "from-blue-500 to-blue-700"
  },
  {
    icon: Trophy,
    title: "Achievement System",
    description: "Earn rewards and badges as you reach your fitness milestones.",
    color: "from-blue-600 to-blue-800"
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Plan your workouts with our intelligent scheduling system.",
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: LineChart,
    title: "Progress Analytics",
    description: "Visualize your fitness journey with detailed analytics and insights.",
    color: "from-blue-500 to-blue-700"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with other fitness enthusiasts and share your progress.",
    color: "from-blue-600 to-blue-800"
  }
]

const GradientBackground = motion.div;

export default function Features() {
  return (
    <section id="features" className="relative py-20 overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 overflow-hidden">
        {/* Moving Gradient Background */}
        <GradientBackground 
          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600/50 to-blue-500 opacity-20"
          style={{ backgroundSize: '200% 100%' }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Darkening overlay - matches Hero */}
        <div className="absolute inset-0 bg-[#030303]/80" />

        {/* Grid pattern - matches Hero */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59,130,246,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59,130,246,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            mask: 'radial-gradient(circle at center, white 30%, transparent 80%)',
          }}
        />

        {/* Glowing Orbs - simplified from original */}
        <motion.div
          className="absolute -right-40 -top-40 h-96 w-96 animate-pulse-slow rounded-full bg-blue-500/20 blur-3xl"
        />
        <motion.div
          className="absolute -left-40 -bottom-40 h-96 w-96 animate-pulse-slow rounded-full bg-purple-500/20 blur-3xl"
        />

        {/* Spotlight effect - matches Hero */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent 
                      animate-spotlight opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              {" "}Features
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to transform your fitness journey and achieve your goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, translateY: -5 }}
                className="relative p-6 bg-gradient-to-b from-white/[0.08] to-transparent rounded-2xl border border-white/[0.08] group backdrop-blur-sm"
              >
                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

