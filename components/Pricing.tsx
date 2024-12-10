'use client'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const tiers = [
  {
    name: 'Basic',
    id: 'tier-basic',
    href: '#',
    priceMonthly: '$9',
    description: 'Everything you need to get started with your fitness journey.',
    features: ['Calorie tracking', 'Basic meal planning', 'Weight logging', 'Limited progress reports'],
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '#',
    priceMonthly: '$19',
    description: 'Advanced features for the dedicated fitness enthusiast.',
    featured: true,
    features: [
      'All Basic features',
      'Advanced meal planning',
      'Detailed analytics',
      'Custom workout plans',
      'Priority support',
    ],
  },
]

export default function Pricing() {
  return (
    <section id="pricing-section" className="relative py-20 overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[200%] h-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/20 blur-[120px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-500">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white">
            Choose your plan
          </p>
          <p className="mt-6 text-lg leading-8 text-[#AAAAAA]">
            Start free and upgrade as you grow. All plans come with a 14-day money-back guarantee.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl p-8 ${
                tier.featured
                  ? 'bg-blue-500/10 ring-2 ring-blue-500'
                  : 'bg-[#1A1A1A] ring-1 ring-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 
                  className={`text-lg font-semibold leading-8 ${
                    tier.featured ? 'text-blue-400' : 'text-white'
                  }`}
                >
                  {tier.name}
                </h3>
                {tier.featured && (
                  <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-400">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">{tier.priceMonthly}</span>
                <span className="text-sm font-semibold leading-6 text-gray-300">/month</span>
              </p>
              <div>
                <Button 
                  className={`mt-6 w-full ${
                    tier.featured 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  Get started
                </Button>
              </div>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-x-3"
                  >
                    <Check className={`h-6 w-5 flex-none ${
                      tier.featured ? 'text-blue-400' : 'text-blue-500'
                    }`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

