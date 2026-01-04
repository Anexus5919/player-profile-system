"use client"

import { SessionProvider, useSession, signOut } from "next-auth/react"
import { createContext, useContext, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    id?: string
    email?: string
    name?: string
    profileId?: string
  } | null
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const user = session?.user ? {
    id: (session.user as any).id,
    email: session.user.email || undefined,
    name: session.user.name || undefined,
    profileId: (session.user as any).profileId,
  } : null

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
