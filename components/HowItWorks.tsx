'use client'
import { 
  ClipboardList, 
  Activity, 
  Target,
  Smartphone,
  BarChart,
  Award
} from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    title: "Create Your Plan",
    description: "Set up your personalized fitness plan based on your goals and preferences.",
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: Activity,
    title: "Track Workouts",
    description: "Log your exercises, sets, and reps with our intuitive tracking system.",
    color: "from-blue-500 to-blue-700"
  },
  {
    icon: Target,
    title: "Set Goals",
    description: "Define your fitness targets and track your progress towards them.",
    color: "from-blue-600 to-blue-800"
  },
  {
    icon: Smartphone,
    title: "Mobile Access",
    description: "Access your workouts and progress from anywhere with our mobile app.",
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: BarChart,
    title: "Track Progress",
    description: "Monitor your improvements with detailed analytics and insights.",
    color: "from-blue-500 to-blue-700"
  },
  {
    icon: Award,
    title: "Achieve Results",
    description: "Reach your fitness goals and celebrate your achievements.",
    color: "from-blue-600 to-blue-800"
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 overflow-hidden">
        {/* Moving Gradient Background */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600/50 to-blue-500 opacity-20"
          style={{
            backgroundSize: "200% 200%",
          }}
        />

        {/* Darkening overlay */}
        <div className="absolute inset-0 bg-[#030303]/80" />

        {/* Grid pattern */}
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

        {/* Glowing Orbs */}
        <div
          className="absolute -right-40 -top-40 h-96 w-96 animate-pulse-slow rounded-full bg-blue-500/20 blur-3xl"
        />
        <div
          className="absolute -left-40 -bottom-40 h-96 w-96 animate-pulse-slow rounded-full bg-purple-500/20 blur-3xl"
        />

        {/* Spotlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent 
                      animate-spotlight opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              {" "}It Works
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Follow these simple steps to start your fitness journey and achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative p-6 bg-gradient-to-b from-white/[0.08] to-transparent rounded-2xl border border-white/[0.08] group backdrop-blur-sm"
            >
              {/* Hover Glow Effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center mb-4`}
                >
                  <step.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                
                <p className="text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

