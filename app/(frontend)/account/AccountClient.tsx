"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, ShoppingCart, LogOut, ArrowRight, Percent, AlertCircle, Mail } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { OrderStatusBadge } from '@/components/shared/status-badge'
import { AddressList } from '@/components/account/AddressList'
import { useLanguage } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { formatPrice, formatDate } from '@/lib/utils/formatting'
import type { OrderStatus } from '@/lib/data/orders'

export interface AccountOrder {
  id: string
  product: { name: string; sku: string }
  quantity: number
  effectivePrice: number
  status: OrderStatus
  submittedAt: string
  submissionId?: string
}

export function AccountClient({ orders }: { orders: AccountOrder[] }) {
  const { t } = useLanguage()
  const { user, isAuthenticated, isLoading, logout, isContractor, refreshUser } = useAuth()
  const router = useRouter()
  const [verificationSent, setVerificationSent] = useState(false)

  async function resendVerification() {
    if (!user?.id) return
    await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractorId: user.id }),
    })
    setVerificationSent(true)
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, router])

  const userOrders = orders

  const groupedOrders = useMemo(() => {
    const map = new Map<string, AccountOrder[]>()
    for (const o of userOrders) {
      const key = o.submissionId ?? o.id
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(o)
    }
    return Array.from(map.entries())
  }, [userOrders])

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex min-h-[50vh] items-center justify-center bg-navy">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        </div>
      </PublicLayout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-navy">
        {/* Header Section */}
        <section className="border-b border-white/10 py-10 lg:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-sans text-3xl font-bold text-white lg:text-4xl">
                  {t.account.title}
                </h1>
                <p className="mt-2 text-ink-muted">
                  {user.contractor?.companyName || user.email}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t.nav.logout}
              </Button>
            </div>

            {/* Unverified email banner — inline under the heading */}
            {isContractor && !user?.contractor?.email_verified_at && (
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-warn/40 bg-warn/10 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
                <div className="flex-1">
                  <p className="font-semibold text-white">Email not yet verified</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    Verify your email to see your contract prices and submit orders.
                    Check your inbox for a link from Coolman.
                  </p>
                  {verificationSent ? (
                    <p className="mt-3 text-sm font-medium text-success">Verification email sent, check your inbox.</p>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={resendVerification}
                      className="mt-3 gap-2 bg-warn text-white hover:bg-warn/90"
                    >
                      <Mail className="h-4 w-4" />
                      Send verification email
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: ShoppingCart,
                  value: userOrders.length,
                  label: 'Total Orders',
                  color: 'blue'
                },
                {
                  icon: Package,
                  value: userOrders.filter(o => o.status === 'Pending' || o.status === 'Acknowledged').length,
                  label: 'In Progress',
                  color: 'amber'
                },
                {
                  icon: Percent,
                  value: user.contractor?.tier_discount_pct
                    ? `${Math.round(user.contractor.tier_discount_pct * 100)}%`
                    : '0%',
                  label: 'Tier Discount',
                  color: 'emerald'
                }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      stat.color === 'blue' ? 'bg-accent/10 text-accent-light' :
                      stat.color === 'amber' ? 'bg-warn/10 text-warn' :
                      'bg-success/10 text-success'
                    }`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-ink-muted">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery Address */}
        {isContractor && (
          <section className="py-4">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <AddressList onChanged={() => { refreshUser() }} />
            </div>
          </section>
        )}

        {/* Orders Section */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="border-b border-white/10 px-6 py-5">
                <h2 className="text-xl font-bold text-white">{t.account.myOrders}</h2>
                <p className="mt-1 text-sm text-ink-muted">{t.account.orderHistory}</p>
              </div>

              <div className="p-6">
                {userOrders.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                      <ShoppingCart className="h-8 w-8 text-ink-muted" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-white">{t.account.noOrders}</h3>
                    <p className="mt-2 text-ink-muted">{t.account.noOrdersMessage}</p>
                    <Button asChild className="mt-6 bg-accent hover:bg-accent-dark">
                      <Link href="/products">
                        {t.account.browseProducts}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groupedOrders.map(([submissionKey, lines]) => {
                      const submissionTotal = lines.reduce((sum, l) => sum + l.effectivePrice, 0)
                      const submittedAt = lines[0]?.submittedAt
                      const status = lines[0]?.status
                      const shortKey = submissionKey.slice(0, 8)
                      return (
                        <div
                          key={submissionKey}
                          className="rounded-xl border border-white/10 bg-white/[0.02] p-4 md:p-6"
                        >
                          <div className="flex flex-col gap-2 border-b border-white/10 pb-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                              <p className="font-mono text-xs text-ink-muted">#{shortKey}</p>
                              <OrderStatusBadge status={status} />
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-ink-muted">{submittedAt ? formatDate(submittedAt) : ''}</span>
                              <span className="font-mono font-semibold text-white">
                                {formatPrice(submissionTotal)}
                              </span>
                            </div>
                          </div>
                          <ul className="mt-3 divide-y divide-white/5">
                            {lines.map((line) => (
                              <li
                                key={line.id}
                                className="flex flex-col gap-1 py-3 md:flex-row md:items-center md:justify-between"
                              >
                                <div>
                                  <p className="font-medium text-white">{line.product.name}</p>
                                  <p className="font-mono text-xs text-ink-muted">{line.product.sku}</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-ink-muted">×{line.quantity}</span>
                                  <span className="font-mono text-white">{formatPrice(line.effectivePrice)}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
