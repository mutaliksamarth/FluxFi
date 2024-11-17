"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Appbar } from "@repo/ui/appbar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AppbarClient() {
  const { data: session, status, update: updateSession } = useSession() // Add update
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/auth/signin')
  }

  // Add function to refresh session
  const refreshSession = async () => {
    await updateSession()
  }

  // Listen for custom event
  useEffect(() => {
    window.addEventListener('profileUpdated', refreshSession)
    return () => window.removeEventListener('profileUpdated', refreshSession)
  }, [])

  return (
    <div>
      <Appbar 
        onSignin={signIn} 
        onSignout={handleSignOut}
        user={session?.user ? { name: session.user.name || '' } : null} 
      />
    </div>
  )
}