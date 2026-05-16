'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, Check } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth/context'
import { useCart } from '@/lib/cart/context'
import { useLanguage } from '@/lib/i18n/context'
import { formatPrice, formatPercentage } from '@/lib/utils/formatting'

export function CartPageClient() {
  const { t } = useLanguage()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { state, setLineQuantity, removeLine } = useCart()

  const submissionIdempotencyKeyRef = useRef<string>(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `sub_${Date.now()}`,
  )
  const [notes, setNotes] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromoCode, setAppliedPromoCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [stalePrice, setStalePrice] = useState<number | null>(null)

  const deliveryAddress = ((user as any)?.contractor?.deliveryAddress ?? '').toString()
  const isEmailVerified = Boolean((user as any)?.contractor?.email_verified_at)
  const showBreakdown = isAuthenticated && isEmailVerified

  async function handleSubmit(confirmedTotal?: number) {
    setSubmitError('')
    setStalePrice(null)
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/orders/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionIdempotencyKey: submissionIdempotencyKeyRef.current,
          lines: state.items.map((it) => ({ productId: it.productId, quantity: it.quantity })),
          deliveryAddress,
          notes,
          promoCode: appliedPromoCode || undefined,
          clientEffectiveTotal: confirmedTotal ?? state.subtotalEffective,
        }),
      })
      const data = await res.json()
      if (res.status === 409 && data.error === 'price_updated') {
        setStalePrice(Number(data.serverEffectiveTotal))
        return
      }
      if (!res.ok) {
        setSubmitError(data.error ?? 'Submission failed.')
        return
      }
      setSubmitSuccess(true)
    } catch {
      setSubmitError('Network error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <PublicLayout>
        <div className="py-24 text-center text-muted-foreground">Loading…</div>
      </PublicLayout>
    )
  }

  if (!isAuthenticated) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="font-sans text-2xl font-bold text-ink">{t.cart.title}</h1>
          <p className="mt-4 text-muted-foreground">Please log in to view your cart and place an order.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link href="/auth/login?next=/cart">{t.nav.login}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">{t.nav.products}</Link>
            </Button>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (submitSuccess) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <Check className="h-8 w-8 text-success" />
          </div>
          <h2 className="mt-6 font-sans text-2xl font-bold text-ink">{t.order.success}</h2>
          <p className="mt-2 text-muted-foreground">{t.order.successMessage}</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild>
              <Link href="/account">{t.nav.myAccount}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">{t.nav.products}</Link>
            </Button>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (state.items.length === 0) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="font-sans text-2xl font-bold text-ink">{t.cart.title}</h1>
          <p className="mt-4 text-muted-foreground">{t.cart.empty}</p>
          <Button className="mt-6" asChild>
            <Link href="/products">{t.nav.products}</Link>
          </Button>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-4 py-12 lg:py-16">
        <h1 className="font-sans text-3xl font-bold text-ink">{t.cart.title}</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {state.items.map((it) => (
              <Card key={it.productId} className="border-border/30">
                <CardContent className="flex gap-4 py-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border/30 bg-muted/50">
                    {it.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.imageUrl} alt={it.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/products/${it.productId}`}
                          className="font-semibold text-ink hover:text-accent-dark"
                        >
                          {it.name}
                        </Link>
                        <p className="font-mono text-xs text-muted-foreground">{it.sku}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(it.productId)}
                        aria-label={t.cart.removeLine}
                        className="flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setLineQuantity(it.productId, Math.max(1, it.quantity - 1))}
                          disabled={it.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min={1}
                          value={it.quantity}
                          onChange={(e) =>
                            setLineQuantity(it.productId, Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-20 border-border/40 text-center font-mono"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setLineQuantity(it.productId, it.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{t.cart.lineTotal}</p>
                        <p className="font-mono text-lg font-bold text-accent-dark">
                          {formatPrice(it.listPrice * it.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:sticky lg:top-20 lg:h-fit">
            <Card className="border-border/30">
              <CardHeader>
                <CardTitle>{t.order.pricing}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-widest">
                      {t.account.deliveryAddress}
                    </Label>
                    <Link href="/account" className="text-xs font-semibold text-accent-dark underline">
                      Edit
                    </Link>
                  </div>
                  {deliveryAddress ? (
                    <Textarea
                      value={deliveryAddress}
                      readOnly
                      rows={3}
                      className="resize-none border-border/40 bg-muted/40 text-sm"
                    />
                  ) : (
                    <div className="rounded-lg border border-warn/30 bg-warn/10 px-3 py-2 text-sm">
                      <p className="font-semibold text-warn">No delivery address on file.</p>
                      <p className="mt-1 text-muted-foreground">
                        Add one in{' '}
                        <Link href="/account" className="font-semibold underline">
                          My Account
                        </Link>
                        .
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.order.listPrice}</span>
                  <span className="font-mono">{formatPrice(state.subtotalList)}</span>
                </div>
                {showBreakdown && state.tierDiscountPct > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>
                      {t.order.tierDiscount} ({formatPercentage(state.tierDiscountPct)})
                    </span>
                    <span className="font-mono">
                      -{formatPrice(state.subtotalList - state.subtotalEffective)}
                    </span>
                  </div>
                )}
                {!showBreakdown && (
                  <div className="rounded bg-muted px-3 py-2 text-xs text-muted-foreground">
                    Verify your email to unlock your contract price.
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-widest">
                    {t.order.promoCode}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder={t.order.promoCodePlaceholder}
                      className="border-border/40 text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!promoCode}
                      onClick={() => setAppliedPromoCode(promoCode)}
                    >
                      {t.order.applyPromo}
                    </Button>
                  </div>
                  {appliedPromoCode && (
                    <p className="text-xs text-success">Code &quot;{appliedPromoCode}&quot; validated on submit.</p>
                  )}
                </div>

                <Label className="text-xs font-semibold uppercase tracking-widest">{t.order.notes}</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="resize-none border-border/40"
                />

                <Separator className="bg-border/30" />

                <div className="flex justify-between pt-2 text-lg font-bold">
                  <span>{t.order.total}</span>
                  <span className="font-mono text-accent-dark">
                    {showBreakdown ? formatPrice(state.subtotalEffective) : formatPrice(state.subtotalList)}
                  </span>
                </div>

                {stalePrice !== null && (
                  <div className="rounded-lg border border-warn/30 bg-warn/10 p-3 text-sm text-warn">
                    <p className="font-semibold">Price has changed</p>
                    <p className="mt-1">
                      New total: <span className="font-mono font-bold">{formatPrice(stalePrice)}</span>
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => handleSubmit(stalePrice)}>
                        Accept &amp; confirm
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => setStalePrice(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                    {submitError}
                  </div>
                )}

                <Button
                  className="mt-2 w-full"
                  size="lg"
                  disabled={
                    isSubmitting || !deliveryAddress || state.items.length === 0 || stalePrice !== null
                  }
                  onClick={() => handleSubmit()}
                >
                  {isSubmitting ? t.order.submitting : t.cart.checkout}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
