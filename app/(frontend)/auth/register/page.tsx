"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'

export default function RegisterPage() {
  const { t } = useLanguage()
  const { register } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 10) {
      setError('Password must be at least 10 characters')
      return
    }

    setIsLoading(true)

    const result = await register({
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
    })
    
    if (result.success) {
      router.push('/account')
    } else {
      setError(result.error || 'Registration failed')
    }
    
    setIsLoading(false)
  }

  const benefits = [
    'Access exclusive contractor pricing',
    'Track orders in real-time',
    'Quick reordering from order history',
    'Priority customer support'
  ]

  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-80px)] bg-navy">
        {/* Left Side - Industrial panel */}
        <div className="relative hidden w-1/2 flex-col justify-between border-r border-white/10 bg-navy-surface p-12 lg:flex">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
            01 / Contractor registration
          </p>
          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-white">
              Open a contractor account.
            </h2>
            <p className="mt-4 text-base text-ink-faint">
              Register to access tiered pricing, place order requests online, and track dispatch status.
            </p>

            <ul className="mt-10 space-y-3 border-t border-white/10 pt-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-4 text-sm">
                  <span className="font-mono text-xs text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-ink-faint">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
            Coolman, established 1998
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="text-center">
              <h1 className="font-sans text-3xl font-bold text-white md:text-4xl">
                {t.auth.register}
              </h1>
              <p className="mt-3 text-ink-muted">
                Create a contractor account to start ordering
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              {error && (
                <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="companyName" className={`text-sm transition-colors ${focusedField === 'companyName' ? 'text-accent-light' : 'text-ink-muted'}`}>
                  {t.auth.companyName} *
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="ABC Construction Sdn Bhd"
                  value={formData.companyName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('companyName')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-ink-faint focus:border-accent focus:ring-accent/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className={`text-sm transition-colors ${focusedField === 'email' ? 'text-accent-light' : 'text-ink-muted'}`}>
                  {t.auth.email} *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-ink-faint focus:border-accent focus:ring-accent/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className={`text-sm transition-colors ${focusedField === 'phone' ? 'text-accent-light' : 'text-ink-muted'}`}>
                  {t.auth.phone} *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+60 12-345 6789"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-ink-faint focus:border-accent focus:ring-accent/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className={`text-sm transition-colors ${focusedField === 'address' ? 'text-accent-light' : 'text-ink-muted'}`}>
                  {t.auth.address} *
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Enter your delivery address"
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('address')}
                  onBlur={() => setFocusedField(null)}
                  rows={2}
                  required
                  className="resize-none border-white/10 bg-white/5 text-white placeholder:text-ink-faint focus:border-accent focus:ring-accent/20"
                />
              </div>
              
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password" className={`text-sm transition-colors ${focusedField === 'password' ? 'text-accent-light' : 'text-ink-muted'}`}>
                    {t.auth.password} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
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
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className={`text-sm transition-colors ${focusedField === 'confirmPassword' ? 'text-accent-light' : 'text-ink-muted'}`}>
                    {t.auth.confirmPassword} *
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-ink-faint focus:border-accent focus:ring-accent/20"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="group h-12 w-full bg-accent-dark text-white hover:bg-accent"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t.auth.registerButton}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
              
            <p className="mt-8 text-center text-sm text-ink-muted">
              {t.auth.hasAccount}{' '}
              <Link href="/auth/login" className="font-medium text-accent-light transition-colors hover:text-white">
                {t.auth.login}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
