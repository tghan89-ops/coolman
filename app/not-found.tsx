import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0a1628' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1rem',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '28rem', width: '100%' }}>
            <p style={{
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#94a3b8',
              margin: '0 0 1rem',
            }}>
              404
            </p>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              fontWeight: 700,
              color: '#f0ede6',
              margin: '0 0 0.75rem',
            }}>
              Page not found
            </h1>
            <p style={{ color: '#64748b', margin: '0 0 2.5rem', fontSize: '1rem' }}>
              The page you are looking for has moved or no longer exists.
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              alignItems: 'center',
            }}>
              <Link
                href="/"
                style={{
                  display: 'inline-block',
                  background: '#3b82f6',
                  color: '#ffffff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  minWidth: '10rem',
                }}
              >
                Back to home
              </Link>
              <Link
                href="/products"
                style={{
                  display: 'inline-block',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#f0ede6',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  minWidth: '10rem',
                }}
              >
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
