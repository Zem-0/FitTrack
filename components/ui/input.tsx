import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
            borderColor: isFocused ? "rgba(59, 130, 246, 0.5)" : "rgba(255, 255, 255, 0.1)"
          }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm",
              "ring-offset-background",
              "placeholder:text-gray-400",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors duration-200",
              icon && "pl-10",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.95,
          }}
          className="absolute inset-0 -z-10 rounded-md bg-blue-500/5 blur-sm"
        />
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input } 