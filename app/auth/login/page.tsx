"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'

export default function LoginPage() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      if (email.toLowerCase() === 'admin@coolman.com.my') {
        router.push('/admin/orders')
      } else {
        router.push('/account')
      }
    } else {
      setError(result.error || 'Login failed')
    }
    
    setIsLoading(false)
  }

  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-80px)] bg-[#0a1628]">
        {/* Left Side - Form */}
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="text-center">
              <h1 className="font-playfair text-3xl font-bold text-white md:text-4xl">
                {t.auth.login}
              </h1>
              <p className="mt-3 text-gray-400">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className={`text-sm transition-colors ${focusedField === 'email' ? 'text-blue-400' : 'text-gray-400'}`}>
                  {t.auth.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className={`text-sm transition-colors ${focusedField === 'password' ? 'text-blue-400' : 'text-gray-400'}`}>
                  {t.auth.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="h-12 border-white/10 bg-white/5 pr-10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="group h-12 w-full bg-blue-600 text-white hover:bg-blue-500" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t.auth.loginButton}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Demo Credentials</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Admin:</span>
                  <code className="rounded bg-white/5 px-2 py-0.5 text-blue-400">admin@coolman.com.my</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Password:</span>
                  <code className="rounded bg-white/5 px-2 py-0.5 text-blue-400">admin123</code>
                </div>
              </div>
            </div>
              
            <p className="mt-8 text-center text-sm text-gray-400">
              {t.auth.noAccount}{' '}
              <Link href="/auth/register" className="font-medium text-blue-400 transition-colors hover:text-blue-300">
                {t.auth.register}
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-blue-600/20 to-blue-900/20 lg:flex">
          <div className="max-w-md p-12 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 ring-1 ring-blue-500/20">
              <span className="font-playfair text-4xl font-bold text-blue-400">C</span>
            </div>
            <h2 className="mt-8 font-playfair text-3xl font-bold text-white">
              Welcome Back
            </h2>
            <p className="mt-4 text-gray-400">
              Access your dashboard to manage orders, track shipments, and explore our complete product catalogue.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
