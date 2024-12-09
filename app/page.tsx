import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'
import AnimatedBackground from '@/components/ui/animated-background'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <div className="relative min-h-screen">
        <Navbar />
        <main className={`flex flex-col ${inter.className}`}>
          <Hero />
          <HowItWorks />
          <Features />
          <Pricing />
          <Footer />
        </main>
      </div>
    </>
  )
}
