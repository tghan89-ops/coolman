"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, ShoppingCart, User, LogOut, ArrowRight, Percent, AlertCircle, Mail } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { OrderStatusBadge } from '@/components/shared/status-badge'
import { useLanguage } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { getEnrichedOrders } from '@/lib/data/orders'
import { formatPrice, formatDate } from '@/lib/utils/formatting'

export default function AccountPage() {
  const { t } = useLanguage()
  const { user, isAuthenticated, isLoading, logout, isContractor } = useAuth()
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

  const allEnrichedOrders = getEnrichedOrders()
  const userOrders = user?.contractor 
    ? allEnrichedOrders.filter(o => o.contractorId === user.contractor!.id)
    : []

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
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-200">Email not yet verified</p>
                  <p className="mt-1 text-sm text-amber-200/70">
                    Verify your email to see your contract prices and submit orders.
                    Check your inbox for a link from Coolman.
                  </p>
                  {verificationSent ? (
                    <p className="mt-3 text-sm font-medium text-green-400">Verification email sent — check your inbox.</p>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={resendVerification}
                      className="mt-3 gap-2 bg-amber-500 text-white hover:bg-amber-600"
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
                  <>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto md:block">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10 text-left text-xs font-medium uppercase tracking-wider text-ink-muted">
                            <th className="pb-4">{t.account.orderId}</th>
                            <th className="pb-4">{t.account.product}</th>
                            <th className="pb-4 text-center">{t.account.quantity}</th>
                            <th className="pb-4 text-right">{t.account.total}</th>
                            <th className="pb-4">{t.account.status}</th>
                            <th className="pb-4">{t.account.date}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {userOrders.map((order) => (
                            <tr key={order.id} className="group">
                              <td className="py-4 font-mono text-sm text-ink-muted">{order.id}</td>
                              <td className="py-4">
                                <div>
                                  <p className="font-medium text-white">{order.product.name}</p>
                                  <p className="text-xs text-ink-muted">{order.product.sku}</p>
                                </div>
                              </td>
                              <td className="py-4 text-center text-white">{order.quantity}</td>
                              <td className="py-4 text-right font-medium text-white">
                                {formatPrice(order.effectivePrice)}
                              </td>
                              <td className="py-4">
                                <OrderStatusBadge status={order.status} />
                              </td>
                              <td className="py-4 text-ink-muted">
                                {formatDate(order.submittedAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="space-y-4 md:hidden">
                      {userOrders.map((order) => (
                        <div 
                          key={order.id}
                          className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-white">{order.product.name}</p>
                              <p className="text-xs text-ink-muted">{order.product.sku}</p>
                            </div>
                            <OrderStatusBadge status={order.status} />
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-ink-muted">{t.account.quantity}</p>
                              <p className="font-medium text-white">{order.quantity}</p>
                            </div>
                            <div>
                              <p className="text-ink-muted">{t.account.total}</p>
                              <p className="font-medium text-white">{formatPrice(order.effectivePrice)}</p>
                            </div>
                            <div>
                              <p className="text-ink-muted">{t.account.orderId}</p>
                              <p className="font-mono text-xs text-ink-muted">{order.id}</p>
                            </div>
                            <div>
                              <p className="text-ink-muted">{t.account.date}</p>
                              <p className="text-ink-muted">{formatDate(order.submittedAt)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
