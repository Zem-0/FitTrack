'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from "@/utils/cn"
import { useEffect, useState } from 'react'
import { SignUpButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { useRouter } from 'next/navigation';


function MovingGradient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600/50 to-blue-500 opacity-20",
          mounted && "animate-gradient"
        )}
        style={{
          backgroundSize: "200% 200%",
        }}
      />
    </div>
  )
}

// ... other imports ...

function FloatingParticles({ count = 90 }) {
  // Generate consistent random positions using a seeded random number
  // Increase brightness by adjusting opacity and adding more particles
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: `${(i * 2.5) % 100}vw`, 
    y: `${(i * 3.7) % 100}vh`,
    scale: 0.5 + (i % 5) * 0.1,
    duration: 20 + (i % 10) * 2,
    opacity: 0.9 // Increased from 0.3
  }));


  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute h-1 w-1 rounded-full bg-blue-400/30"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: particle.scale,
          }}
          animate={{
            x: [particle.x, `${(particle.id * 3.3 + 50) % 100}vw`],
            y: [particle.y, `${(particle.id * 4.2 + 30) % 100}vh`],
            scale: particle.scale,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function GlowingOrbs() {
  return (
    <>
      <motion.div
        className="absolute -right-40 -top-40 h-96 w-96 animate-pulse-slow rounded-full bg-blue-500/20 blur-3xl"
      />
      <motion.div
        className="absolute -left-40 -bottom-40 h-96 w-96 animate-pulse-slow rounded-full bg-purple-500/20 blur-3xl"
      />
    </>
  )
}

export default function Hero() {
  const { isSignedIn } = useUser();
  const router = useRouter();

    useEffect(() => {
    const checkUserProfile = async () => {
      if (isSignedIn) {
        try {
          const response = await fetch('/api/user-profile');
          const profile = await response.json();
          
          if (profile) {
            router.push('/dashboard');
          } else {
            router.push('/onboarding');
          }
        } catch (error) {
          console.error('Error checking profile:', error);
          router.push('/onboarding');
        }
      }
    };

    checkUserProfile();
  }, [isSignedIn, router]);
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030303] pt-32 pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <MovingGradient />
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

        <GlowingOrbs />
        <FloatingParticles />

        {/* Spotlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent 
                      animate-spotlight opacity-20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <motion.h1 
              className="bg-gradient-to-r from-white/80 to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Transform Your Fitness Journey
            </motion.h1>
            <motion.p
              className="mt-6 text-lg leading-8 text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Track your workouts, monitor your progress, and achieve your fitness goals 
              with our comprehensive fitness tracking platform. Whether you're just starting 
              or a seasoned athlete, we've got the tools you need to succeed.
            </motion.p>
            <motion.div
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {!isSignedIn ? (
                <SignUpButton mode="modal">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 transition-colors">
                    Start Your Journey
                  </Button>
                </SignUpButton>
              ) : (
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 transition-colors" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              )}
              <Button variant="link" className="text-white hover:text-blue-400 transition-colors">
                Explore Features <span aria-hidden="true">→</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}