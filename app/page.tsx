"use client"

import { useAuth } from "@/lib/auth-context"
import AuthPage from "@/components/auth/AuthPage"
import CreateProfile from "@/components/profile/CreateProfile"

export default function Home() {
  const { isAuthenticated, login } = useAuth()

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={login} />
  }

  return (
    <main>
      <CreateProfile />
    </main>
  )
}