import Image from 'next/image'

const testimonials = [
  {
    body: 'This app has completely transformed my fitness journey. I\'ve never felt more in control of my health.',
    author: {
      name: 'Emily Johnson',
      handle: 'emilyfitness',
      imageUrl: '/placeholder.svg',
    },
  },
  {
    body: 'The meal tracking feature is a game-changer. It\'s so easy to use and has helped me stay on track with my nutrition goals.',
    author: {
      name: 'Michael Chen',
      handle: 'mikefitlife',
      imageUrl: '/placeholder.svg',
    },
  },
  {
    body: 'I love how I can see my progress over time. It\'s incredibly motivating and keeps me pushing towards my goals.',
    author: {
      name: 'Sarah Thompson',
      handle: 'sarahgetsfit',
      imageUrl: '/placeholder.svg',
    },
  },
]

export default function Testimonials() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Hear from our satisfied users
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author.handle} className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                <p className="text-gray-700">{testimonial.body}</p>
                <div className="mt-6 flex items-center gap-x-4">
                  <Image className="h-10 w-10 rounded-full bg-gray-50" src={testimonial.author.imageUrl} alt="" width={40} height={40} />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                    <div className="text-gray-600">@{testimonial.author.handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

