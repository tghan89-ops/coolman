'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'

export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Frontend route error:', error)
  }, [error])

  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-navy px-4 py-16">
        <div className="w-full max-w-md text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
            Error
          </p>
          <h1 className="mt-4 font-sans text-3xl font-bold text-white md:text-4xl">
            Something went wrong
          </h1>
          <p className="mt-3 text-ink-muted">
            We hit an unexpected issue loading this page. Try again, or head back to safety.
          </p>
          {error.digest && (
            <p className="mt-4 font-mono text-xs text-ink-faint">
              Reference: {error.digest}
            </p>
          )}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={reset}
              className="bg-accent-dark text-white hover:bg-accent"
            >
              Try again
            </Button>
            <Button asChild variant="outline-dark">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
