'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ResetPasswordInner() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!token) setError('Missing or invalid reset link. Please request a new one.')
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Reset failed. Your link may have expired — please request a new one.')
        return
      }
      setSuccess(true)
      setTimeout(() => router.push('/auth/login'), 2000)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-navy px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-sans text-3xl font-bold text-white md:text-4xl">Choose a new password</h1>
          <p className="mt-3 text-ink-muted">At least 8 characters.</p>
        </div>

        {success ? (
          <div className="mt-10 rounded-lg border border-success/30 bg-success/10 p-6 text-sm text-success">
            <p className="font-semibold">Password updated.</p>
            <p className="mt-2 text-ink-muted">Redirecting you to sign in…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {error && (
              <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-ink-muted">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={!token}
                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-accent focus:ring-accent/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-sm text-ink-muted">Confirm new password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                disabled={!token}
                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-accent focus:ring-accent/20"
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full bg-accent-dark text-white hover:bg-accent"
              disabled={isLoading || !token}
            >
              {isLoading ? 'Saving...' : 'Save new password'}
            </Button>
            <p className="text-center text-sm text-ink-muted">
              <Link href="/auth/forgot-password" className="font-medium text-accent-light hover:text-white">
                Send a fresh reset link
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<div className="min-h-[calc(100vh-80px)] bg-navy" />}>
        <ResetPasswordInner />
      </Suspense>
    </PublicLayout>
  )
}
