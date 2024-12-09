'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Activity,
  Settings,
  Calendar,
  BarChart,
  History,
  UserCircle,
  Utensils,
  MessageCircle,
  Dumbbell
} from 'lucide-react';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: "text-sky-500"
  },
  {
    label: 'Food Tracker',
    icon: Utensils,
    color: "text-yellow-500",
    href: '/dashboard/food-tracker',
  },
  {
    label: 'Workout Tracker',
    icon: Activity,
    color: "text-green-500",
    href: '/dashboard/workout-tracker',
  },
  {
    label: 'Fitness Chat',
    icon: MessageCircle,
    color: "text-violet-500",
    href: '/dashboard/fitness-chat',
  },
  {
    label: 'Profile',
    icon: UserCircle,
    color: "text-orange-500",
    href: '/dashboard/profile',
  },
  {
    label: 'Settings',
    icon: Settings,
    color: "text-emerald-500",
    href: '/dashboard/settings',
  }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="mb-6 flex items-center pl-4">
          <Dumbbell className="h-8 w-8 text-purple-500" />
          <div className="ml-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              FitTrack
              <span className="text-sm ml-1 bg-gradient-to-r from-purple-500 to-pink-600 text-transparent bg-clip-text">
                PRO
              </span>
            </h1>
          </div>
        </div>
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-white">
          Overview
        </h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}