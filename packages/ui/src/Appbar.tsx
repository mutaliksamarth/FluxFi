"use client"

import { Button } from "./button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "../../lib/util"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-purple-200 dark:data-[state=unchecked]:bg-purple-900",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

interface AppbarProps {
    user: { name: string } | null
    onSignin: () => void
    onSignout: () => void
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    const { theme, setTheme } = useTheme()

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                            FluxFi
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {user?.name && (
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Hello, {user.name}
                            </span>
                        )}
                        
                        <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <Switch
                                checked={theme === 'dark'}
                                onCheckedChange={(checked) => {
                                    setTheme(checked ? 'dark' : 'light')
                                }}
                            />
                            <Moon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>

                        <Button 
                            variant="default"
                            onClick={user ? onSignout : onSignin}
                        >
                            {user ? "Logout" : "Login"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}