import Link from 'next/link'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-navy px-4 py-16">
        <div className="w-full max-w-md text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
            404
          </p>
          <h1 className="mt-4 font-sans text-3xl font-bold text-white md:text-4xl">
            Page not found
          </h1>
          <p className="mt-3 text-ink-muted">
            The page you are looking for has moved or no longer exists.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="bg-accent-dark text-white hover:bg-accent">
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
