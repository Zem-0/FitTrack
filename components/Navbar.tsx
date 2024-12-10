'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  
  const navItems = [
    { name: 'Features', href: 'features' },
    { name: 'How It Works', href: 'how-it-works' },
    { name: 'Pricing', href: 'pricing-section' }
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navHeight = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - navHeight
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const sections = navItems.map(item => document.getElementById(item.href))
      const currentSection = sections.find(section => {
        if (!section) return false
        const rect = section.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      })
      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div 
        className="mx-4 mt-4 w-full max-w-4xl pointer-events-auto transition-transform duration-300"
        style={{ transform: `translateY(${scrolled ? 0 : 8}px)` }}
      >
        <div
          className="relative rounded-full border border-white/10 shadow-lg backdrop-blur-md transition-all duration-300 hover:translate-y-[-2px]"
          style={{ backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)' }}
        >
          <div className="relative px-6">
            <div className="flex h-14 items-center justify-between">
              {/* Logo */}
              <div className="flex items-center transition-transform hover:scale-105">
                <Link 
                  href="/" 
                  className="text-lg font-bold text-white"
                  onClick={(e) => {
                    e.preventDefault()
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  FitTrack<span className="text-blue-400">Pro</span>
                </Link>
              </div>

              {/* Navigation Items */}
              <div className="hidden md:flex items-center space-x-6">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`relative px-3 py-2 text-sm font-medium transition-all duration-300
                      ${activeSection === item.href ? 'text-blue-400' : 'text-gray-200 hover:text-white hover:scale-105'}`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div
                      className={`absolute inset-0 rounded-full transition-colors duration-300 
                        ${activeSection === item.href ? 'bg-white/10' : ''}`}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 transition-transform duration-200"
                      style={{ transform: `scaleX(${activeSection === item.href ? 1 : 0})` }}
                    />
                  </button>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-3">
                {!isSignedIn ? (
                  <>
                    <div className="hidden sm:block transition-transform hover:scale-105">
                      <SignInButton mode="modal">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-300"
                        >
                          Log in
                        </Button>
                      </SignInButton>
                    </div>
                    <div className="transition-transform hover:scale-105">
                      <SignUpButton mode="modal">
                        <Button 
                          size="sm"
                          className="bg-blue-600/90 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 
                                   hover:shadow-blue-500/30 backdrop-blur-sm transition-all duration-300"
                        >
                          Sign up
                        </Button>
                      </SignUpButton>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="transition-transform hover:scale-105">
                      <Link href="/dashboard">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-300"
                        >
                          Dashboard
                        </Button>
                      </Link>
                    </div>
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
                <button
                  className="sm:hidden p-2 text-white hover:bg-white/10 rounded-full transition-transform hover:scale-105"
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}