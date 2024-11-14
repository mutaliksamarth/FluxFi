import * as React from "react"
import { cn } from "../../lib/util"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm",
          "bg-white dark:bg-gray-800/50",
          "border-gray-200 dark:border-gray-700/50",
          "text-gray-900 dark:text-gray-100",
          "placeholder:text-gray-500 dark:placeholder:text-gray-500",
          "transition-colors duration-200",
          "focus:border-purple-500 dark:focus:border-purple-500",
          "focus-visible:outline-none focus-visible:ring-1",
          "focus-visible:ring-purple-500/50 dark:focus-visible:ring-purple-500/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
