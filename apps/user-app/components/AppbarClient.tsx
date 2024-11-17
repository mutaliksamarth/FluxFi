"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Appbar } from "@repo/ui/appbar"
import { useRouter } from "next/navigation"


export function AppbarClient() {
  const { data: session, status, update: updateSession } = useSession() 
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/auth/signin'
  }

 
  const refreshSession = async () => {
    await updateSession()
  }

  

  return (
    <div>
      <Appbar 
        onSignin={signIn} 
        //@ts-ignore
        onSignout={handleSignOut}
        user={session?.user ? { name: session.user.name || '' } : null} 
      />
    </div>
  )
}