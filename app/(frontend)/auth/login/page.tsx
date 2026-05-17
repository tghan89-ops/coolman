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
      <div className="flex min-h-[calc(100vh-80px)] bg-navy">
        {/* Left Side - Form */}
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="text-center">
              <h1 className="font-sans text-3xl font-bold text-white md:text-4xl">
                {t.auth.login}
              </h1>
              <p className="mt-3 text-ink-muted">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              {error && (
                <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className={`text-sm transition-colors ${focusedField === 'email' ? 'text-accent-light' : 'text-ink-muted'}`}>
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
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-ink-faint focus:border-accent focus:ring-accent/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className={`text-sm transition-colors ${focusedField === 'password' ? 'text-accent-light' : 'text-ink-muted'}`}>
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
                    className="h-12 border-white/10 bg-white/5 pr-10 text-white placeholder:text-ink-faint focus:border-accent focus:ring-accent/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="text-right text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-accent-light transition-colors hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="group h-12 w-full bg-accent-dark text-white hover:bg-accent"
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
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-ink-muted">
              {t.auth.noAccount}{' '}
              <Link href="/auth/register" className="font-medium text-accent-light transition-colors hover:text-white">
                {t.auth.register}
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Industrial panel */}
        <div className="relative hidden w-1/2 flex-col justify-between border-l border-white/10 bg-navy-surface p-12 lg:flex">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
            01 / Sign in
          </p>
          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-white">
              Welcome back.
            </h2>
            <p className="mt-4 text-base text-ink-faint">
              Manage orders, track dispatch, and access your contractor pricing.
            </p>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
            Coolman, established 1998
          </p>
        </div>
      </div>
    </PublicLayout>
  )
}
