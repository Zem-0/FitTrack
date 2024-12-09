'use client'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram } from 'lucide-react'

const navigation = {
  main: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Jobs', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Accessibility', href: '#' },
    { name: 'Partners', href: '#' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: Facebook,
    },
    {
      name: 'Twitter',
      href: '#',
      icon: Twitter,
    },
    {
      name: 'Instagram',
      href: '#',
      icon: Instagram,
    },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#030303] border-t border-[#1d1d1d]">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <motion.nav 
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" 
          aria-label="Footer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {navigation.main.map((item) => (
            <motion.div 
              key={item.name} 
              className="pb-6"
              whileHover={{ y: -2 }}
            >
              <a 
                href={item.href} 
                className="text-sm leading-6 text-[#AAAAAA] hover:text-white transition-colors duration-300"
              >
                {item.name}
              </a>
            </motion.div>
          ))}
        </motion.nav>

        <motion.div 
          className="mt-10 flex justify-center space-x-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {navigation.social.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="text-[#AAAAAA] hover:text-blue-500 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </motion.a>
          ))}
        </motion.div>

        <motion.p 
          className="mt-10 text-center text-xs leading-5 text-[#AAAAAA]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          &copy; {new Date().getFullYear()} FitTrackPro. All rights reserved.
        </motion.p>
      </div>
    </footer>
  )
}

