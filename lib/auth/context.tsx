"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export type UserRole = 'contractor' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  contractor?: {
    id: string
    companyName: string
    email: string
    phone?: string
    deliveryAddress?: string
    tier_discount_pct: number
    status: string
    email_verified_at?: string | null
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isContractor: boolean
}

interface RegisterData {
  companyName: string
  email: string
  phone: string
  address: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function buildContractorUser(contractorData: any): User {
  return {
    id: contractorData.id,
    email: contractorData.email,
    role: 'contractor',
    contractor: {
      id: contractorData.id,
      companyName: contractorData.companyName,
      email: contractorData.email,
      phone: contractorData.phone,
      deliveryAddress: contractorData.deliveryAddress,
      tier_discount_pct: contractorData.tier_discount_pct ?? 0,
      status: contractorData.status ?? 'Active',
      email_verified_at: contractorData.email_verified_at ?? null,
    },
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const contractorRes = await fetch('/api/contractors/me', { credentials: 'include' })
        if (contractorRes.ok) {
          const { user: d } = await contractorRes.json()
          setUser(buildContractorUser(d))
          return
        }
        const adminRes = await fetch('/api/users/me', { credentials: 'include' })
        if (adminRes.ok) {
          const { user: d } = await adminRes.json()
          setUser({ id: d.id, email: d.email, role: 'admin' })
        }
      } catch {
        // DB not provisioned or no session — expected in dev
      } finally {
        setIsLoading(false)
      }
    }
    checkSession()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/contractors/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const { user: d } = await res.json()
        setUser(buildContractorUser(d))
        return { success: true }
      }
    } catch { /* fall through */ }

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const { user: d } = await res.json()
        setUser({ id: d.id, email: d.email, role: 'admin' })
        return { success: true }
      }
    } catch { /* fall through */ }

    return { success: false, error: 'Invalid email or password' }
  }, [])

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: data.companyName,
          email: data.email,
          phone: data.phone,
          deliveryAddress: data.address,
          password: data.password,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        return { success: false, error: body?.error ?? 'Registration failed' }
      }
      return login(data.email, data.password)
    } catch {
      return { success: false, error: 'Network error — please try again' }
    }
  }, [login])

  const logout = useCallback(() => {
    setUser(null)
    Promise.allSettled([
      fetch('/api/contractors/logout', { method: 'POST', credentials: 'include' }),
      fetch('/api/users/logout', { method: 'POST', credentials: 'include' }),
    ])
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: user !== null,
      isAdmin: user?.role === 'admin',
      isContractor: user?.role === 'contractor',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
