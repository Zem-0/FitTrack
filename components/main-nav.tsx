import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { NavItem } from "@/types"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">
          FitTrack
        </span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center text-sm font-medium text-muted-foreground",
              pathname === "/dashboard" && "text-foreground"
            )}
          >
            Overview
          </Link>
          <Link
            href="/dashboard/food-tracker"
            className={cn(
              "flex items-center text-sm font-medium text-muted-foreground",
              pathname === "/dashboard/food-tracker" && "text-foreground"
            )}
          >
            Food Tracker
          </Link>
          <Link
            href="/dashboard/workout-tracker"
            className={cn(
              "flex items-center text-sm font-medium text-muted-foreground",
              pathname === "/dashboard/workout-tracker" && "text-foreground"
            )}
          >
            Workout Tracker
          </Link>
          <Link
            href="/dashboard/fitness-chat"
            className={cn(
              "flex items-center text-sm font-medium text-muted-foreground",
              pathname === "/dashboard/fitness-chat" && "text-foreground"
            )}
          >
            Fitness Chat
          </Link>
        </nav>
      ) : null}
    </div>
  )
} 