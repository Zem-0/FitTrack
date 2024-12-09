'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { scrollY } = useScroll()
  
  // Redirect to dashboard if user is signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.15)']
  )

  const navItems = [
    { name: 'Features', href: 'features' },
    { name: 'How It Works', href: 'how-it-works' },
    { name: 'Pricing', href: 'pricing-section' }
  ]

  const scrollToSection = (sectionId: string) => {
    console.log('Attempting to scroll to:', sectionId)
    const element = document.getElementById(sectionId)
    
    if (element) {
      const navHeight = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - navHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    } else {
      console.warn(`Section with ID "${sectionId}" not found`)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = navItems.map(item => document.getElementById(item.href))
      const currentSection = sections.find(section => {
        if (!section) return false
        const rect = section.getBoundingClientRect()
        const topOffset = 100
        return rect.top <= topOffset && rect.bottom >= topOffset
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="mx-4 mt-4 w-full max-w-4xl pointer-events-auto"
        animate={{
          y: scrolled ? 0 : 8,
        }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 100,
        }}
      >
        <motion.div
          className="relative rounded-full border border-white/10 shadow-lg backdrop-blur-md"
          style={{ backgroundColor }}
          whileHover={{
            y: -2,
            transition: { duration: 0.2 }
          }}
        >
          <div className="relative px-6">
            <div className="flex h-14 items-center justify-between">
              {/* Logo */}
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link 
                  href="/" 
                  className="text-lg font-bold text-white"
                  onClick={(e) => {
                    e.preventDefault()
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  FitTrack
                  <span className="text-blue-400">Pro</span>
                </Link>
              </motion.div>

              {/* Navigation Items */}
              <div className="hidden md:flex items-center space-x-6">
                {navItems.map((item) => (
                  <motion.button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300
                      ${activeSection === item.href ? 'text-blue-400' : 'text-gray-200 hover:text-white'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {/* Hover/Active indicator */}
                    <motion.div
                      className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                        activeSection === item.href ? 'bg-white/10' : ''
                      }`}
                      layoutId={`nav-${item.href}`}
                    />
                    {/* Underline effect */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeSection === item.href ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-3">
                {!isSignedIn ? (
                  <>
                    <motion.div
                      className="hidden sm:block"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <SignInButton mode="modal">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-300"
                        >
                          <span className="relative group">
                            Log in
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
                          </span>
                        </Button>
                      </SignInButton>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <SignUpButton mode="modal">
                        <Button 
                          size="sm"
                          className="bg-blue-600/90 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 
                                   hover:shadow-blue-500/30 backdrop-blur-sm transition-all duration-300
                                   hover:px-6"
                        >
                          Sign up
                        </Button>
                      </SignUpButton>
                    </motion.div>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href="/dashboard">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-300"
                        >
                          Dashboard
                        </Button>
                      </Link>
                    </motion.div>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8"
                        }
                      }}
                    />
                  </div>
                )}

                {/* Mobile Menu Button */}
                <motion.button
                  className="sm:hidden p-2 text-white hover:bg-white/10 rounded-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}