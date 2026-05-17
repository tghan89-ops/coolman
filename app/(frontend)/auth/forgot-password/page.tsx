'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Could not send reset email. Please try again.')
      } else {
        setSent(true)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-navy px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="font-sans text-3xl font-bold text-white md:text-4xl">Forgot your password?</h1>
            <p className="mt-3 text-ink-muted">
              Enter the email you signed up with and we&apos;ll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="mt-10 rounded-lg border border-success/30 bg-success/10 p-6 text-sm text-success">
              <p className="font-semibold">Check your inbox.</p>
              <p className="mt-2 text-ink-muted">
                If an account exists for <span className="font-mono">{email}</span>, a reset
                link is on its way. The link expires in 1 hour.
              </p>
              <p className="mt-4">
                <Link href="/auth/login" className="font-semibold text-accent-light hover:text-white">
                  Back to sign in →
                </Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              {error && (
                <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-ink-muted">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-ink-faint focus:border-accent focus:ring-accent/20"
                />
              </div>
              <Button
                type="submit"
                className="group h-12 w-full bg-accent-dark text-white hover:bg-accent"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : (
                  <span className="flex items-center gap-2">
                    Send reset link <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
              <p className="text-center text-sm text-ink-muted">
                Remembered it?{' '}
                <Link href="/auth/login" className="font-medium text-accent-light hover:text-white">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
