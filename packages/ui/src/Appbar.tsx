"use client"

import { Button } from "./button"
import { Moon, Sun, Settings, LogOut, User } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "../../lib/util"
import { useState, useEffect } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-purple-200 dark:data-[state=unchecked]:bg-purple-900 dark:border-purple-700 dark:border-b-white/10",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 dark:border dark:border-purple-600"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

// First create a DropdownMenuItem component for consistent styling
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenu.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Item>
>(({ className, children, ...props }, ref) => (
  <DropdownMenu.Item
    ref={ref}
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 text-sm outline-none cursor-default select-none rounded-md transition-colors",
      "text-gray-700 dark:text-gray-300",
      "hover:bg-purple-50 dark:hover:bg-purple-950/50",
      "focus:bg-purple-50 dark:focus:bg-purple-950/50",
      className
    )}
    {...props}
  >
    {children}
  </DropdownMenu.Item>
));

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
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY
            
            if (currentScrollY > lastScrollY && currentScrollY > 30) { // Scrolling down & past header
                setIsVisible(false)
            } else { // Scrolling up
                setIsVisible(true)
            }
            
            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', controlNavbar)
        
        return () => {
            window.removeEventListener('scroll', controlNavbar)
        }
    }, [lastScrollY])

    return (
        <nav className={cn(
            "border-b dark:border-gray-800",
            "fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-sm transition-all duration-300 transform",
            isVisible ? 'translate-y-0' : '-translate-y-full'
        )}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 group">
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-800 dark:from-purple-400 dark:via-pink-300 dark:to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
                            FluxFi
                        </div>
                        <div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-700 to-transparent opacity-50"></div>
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

                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition">
                                    {user ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                                </button>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                  className={cn(
                                    "z-50 min-w-[240px] overflow-hidden rounded-xl border shadow-lg",
                                    "bg-white dark:bg-gray-900",
                                    "border-gray-200 dark:border-gray-800",
                                    "animate-in fade-in-0 zoom-in-95"
                                  )}
                                >
                                  <div className="px-3 py-2.5 border-b border-gray-200 dark:border-gray-800">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      
                                    </p>
                                  </div>
                                
                                  <div className="p-1.5">
                                    <DropdownMenuItem>
                                      <User className="w-4 h-4" />
                                      Profile
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem>
                                      <Settings className="w-4 h-4" />
                                      Settings
                                    </DropdownMenuItem>
                                  </div>
                                
                                  <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-800 m-1" />
                                  
                                  <div className="p-1.5">
                                    <DropdownMenuItem 
                                      className="text-red-600 dark:text-red-400"
                                      onClick={onSignout}
                                    >
                                      <LogOut className="w-4 h-4" />
                                      Sign out
                                    </DropdownMenuItem>
                                  </div>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    </div>
                </div>
            </div>
        </nav>
    )
}