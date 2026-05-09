"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { type Contractor, getContractorByEmail } from '@/lib/data/contractors'

export type UserRole = 'contractor' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  contractor?: Contractor
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

// Admin credentials for demo
const ADMIN_EMAIL = 'admin@coolman.com.my'
const ADMIN_PASSWORD = 'admin123'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('coolman_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('coolman_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check for admin login
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin-001',
        email: ADMIN_EMAIL,
        role: 'admin',
      }
      setUser(adminUser)
      localStorage.setItem('coolman_user', JSON.stringify(adminUser))
      return { success: true }
    }

    // Check for contractor login
    const contractor = getContractorByEmail(email)
    if (contractor) {
      // In a real app, we'd verify the password
      // For demo, any password works for existing contractors
      const contractorUser: User = {
        id: contractor.id,
        email: contractor.email,
        role: 'contractor',
        contractor,
      }
      setUser(contractorUser)
      localStorage.setItem('coolman_user', JSON.stringify(contractorUser))
      return { success: true }
    }

    // Check localStorage for registered users
    const registeredUsers = JSON.parse(localStorage.getItem('coolman_registered_users') || '[]')
    const registeredUser = registeredUsers.find((u: { email: string; password: string }) => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (registeredUser) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: registeredUser.email,
        role: 'contractor',
        contractor: {
          id: `con-new-${Date.now()}`,
          companyName: registeredUser.companyName,
          contactName: registeredUser.companyName,
          email: registeredUser.email,
          phone: registeredUser.phone,
          deliveryAddress: registeredUser.address,
          tier_discount_pct: 0,
          status: 'Active' as const,
          registeredAt: new Date().toISOString(),
          lastOrderAt: null,
          totalOrders: 0,
        },
      }
      setUser(newUser)
      localStorage.setItem('coolman_user', JSON.stringify(newUser))
      return { success: true }
    }

    return { success: false, error: 'Invalid email or password' }
  }, [])

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check if email already exists
    const existingContractor = getContractorByEmail(data.email)
    if (existingContractor) {
      return { success: false, error: 'Email already registered' }
    }

    // Check registered users in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('coolman_registered_users') || '[]')
    const existingUser = registeredUsers.find((u: { email: string }) => 
      u.email.toLowerCase() === data.email.toLowerCase()
    )
    if (existingUser) {
      return { success: false, error: 'Email already registered' }
    }

    // Save new user
    registeredUsers.push(data)
    localStorage.setItem('coolman_registered_users', JSON.stringify(registeredUsers))

    // Auto-login after registration
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      role: 'contractor',
      contractor: {
        id: `con-new-${Date.now()}`,
        companyName: data.companyName,
        contactName: data.companyName,
        email: data.email,
        phone: data.phone,
        deliveryAddress: data.address,
        tier_discount_pct: 0,
        status: 'Active' as const,
        registeredAt: new Date().toISOString(),
        lastOrderAt: null,
        totalOrders: 0,
      },
    }
    setUser(newUser)
    localStorage.setItem('coolman_user', JSON.stringify(newUser))

    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('coolman_user')
  }, [])

  const isAuthenticated = user !== null
  const isAdmin = user?.role === 'admin'
  const isContractor = user?.role === 'contractor'

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated,
      isAdmin,
      isContractor,
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
