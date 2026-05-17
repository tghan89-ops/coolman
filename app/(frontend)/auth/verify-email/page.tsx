'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token found in this link.')
      return
    }
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setStatus('error')
          setMessage(data.error)
        } else {
          setStatus('success')
          setMessage(data.message)
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      })
  }, [token])

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-80px)] bg-navy">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-12">
          {status === 'loading' && <p className="text-ink-muted">Verifying your email…</p>}
          {status === 'success' && (
            <>
              <h1 className="text-2xl font-bold text-white">Email verified</h1>
              <p className="text-ink-muted">Your account is now active. You can place orders.</p>
              <Button asChild className="bg-accent-dark text-white hover:bg-accent">
                <Link href="/account">Go to my account</Link>
              </Button>
            </>
          )}
          {status === 'error' && (
            <>
              <h1 className="text-2xl font-bold text-white">Verification failed</h1>
              <p className="text-ink-muted">{message}</p>
              <Button asChild variant="outline-dark">
                <Link href="/account">Back to account</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <PublicLayout>
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-navy">
          <p className="text-ink-muted">Loading…</p>
        </div>
      </PublicLayout>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
