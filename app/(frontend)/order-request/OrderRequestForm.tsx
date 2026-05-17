'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { Minus, Plus, Check, AlertCircle } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { calculateEffectivePrice } from '@/lib/pricing/calculate'
import { formatPrice, formatPercentage } from '@/lib/utils/formatting'

export interface OrderRequestProduct {
  id: string | number
  sku: string
  name: string
  listPrice: number
  diameter?: string | number
  imageUrl?: string | null
}

interface OrderRequestFormProps {
  product: OrderRequestProduct | null
  productId: string | null
  initialQuantity?: number
}

const DRAFT_KEY = 'coolman_order_draft'

interface DraftData {
  quantity: number
  deliveryAddress: string
  notes: string
  promoCode: string
}

function loadDraft(): DraftData | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveDraft(data: DraftData) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
  } catch { /* ignore storage errors */ }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch { /* ignore */ }
}

export function OrderRequestForm({ product, productId, initialQuantity = 1 }: OrderRequestFormProps) {
  const { t } = useLanguage()
  const { user, isAuthenticated, isLoading: authLoading, isContractor } = useAuth()

  // Idempotency key — generated once on mount, never changes
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID())

  const [quantity, setQuantity] = useState(initialQuantity)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromoCode, setAppliedPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)

  // Stale-price 409 state
  const [stalePriceInfo, setStalePriceInfo] = useState<{
    serverEffectiveTotal: number
    serverEffectivePerUnit: number
  } | null>(null)

  const tierDiscountPct = user?.contractor?.tier_discount_pct ?? 0
  const isEmailVerified = Boolean(user?.contractor?.email_verified_at)

  // Effective price gate: show breakdown only to verified contractors
  const showPriceBreakdown = isContractor && isEmailVerified

  const pricing = useMemo(() => {
    if (!product) return null
    return calculateEffectivePrice(
      product.listPrice,
      showPriceBreakdown ? tierDiscountPct : 0,
      0,
    )
  }, [product, tierDiscountPct, showPriceBreakdown])

  // Rehydrate draft on mount (after user loads so delivery address fallback works)
  useEffect(() => {
    const draft = loadDraft()
    if (draft) {
      setQuantity(draft.quantity || 1)
      setDeliveryAddress(draft.deliveryAddress || '')
      setNotes(draft.notes || '')
      setPromoCode(draft.promoCode || '')
      setDraftRestored(true)
    } else if (user?.contractor?.deliveryAddress) {
      setDeliveryAddress(user.contractor.deliveryAddress)
    }
  }, [user])

  function handleDraftSave() {
    saveDraft({ quantity, deliveryAddress, notes, promoCode })
  }

  const effectiveTotal = pricing ? pricing.effectivePrice * quantity : 0

  async function handleSubmit(e: React.FormEvent, confirmedStalePrice?: number) {
    e.preventDefault()
    setSubmitError('')
    setStalePriceInfo(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/orders/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity,
          deliveryAddress,
          notes,
          promoCode: appliedPromoCode || undefined,
          idempotencyKey: idempotencyKeyRef.current,
          clientEffectivePrice: confirmedStalePrice ?? effectiveTotal,
        }),
      })

      const data = await res.json()

      if (res.status === 409 && data.error === 'price_updated') {
        setStalePriceInfo({
          serverEffectiveTotal: data.serverEffectiveTotal,
          serverEffectivePerUnit: data.serverEffectivePerUnit,
        })
        return
      }

      if (!res.ok) {
        setSubmitError(data.error ?? 'Submission failed. Please try again.')
        return
      }

      clearDraft()
      setSubmitSuccess(true)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <PublicLayout>
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-navy">
          <p className="text-ink-muted">{t.common.loading}</p>
        </div>
      </PublicLayout>
    )
  }

  if (!isAuthenticated) {
    return (
      <PublicLayout>
        <div className="min-h-[calc(100vh-80px)] bg-navy">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <Alert className="border border-white/10 bg-white/5 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-white">{t.order.loginRequired}</AlertTitle>
              <AlertDescription className="mt-2 text-ink-muted">{t.order.loginToOrder}</AlertDescription>
            </Alert>
            <div className="mt-6 flex gap-4">
              <Button asChild className="bg-accent-dark text-white hover:bg-accent"><Link href="/auth/login">{t.nav.login}</Link></Button>
              <Button variant="outline" asChild className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"><Link href="/auth/register">{t.nav.register}</Link></Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="min-h-[calc(100vh-80px)] bg-navy">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <Alert className="border border-white/10 bg-white/5 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-white">No Product Selected</AlertTitle>
              <AlertDescription className="mt-2 text-ink-muted">
                Please select a product from our catalogue to place an order.
              </AlertDescription>
            </Alert>
            <div className="mt-6">
              <Button asChild className="bg-accent-dark text-white hover:bg-accent"><Link href="/products">{t.hero.cta}</Link></Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (submitSuccess) {
    return (
      <PublicLayout>
        <div className="min-h-[calc(100vh-80px)] bg-navy">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <Card className="border border-white/10 bg-white/5">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <h2 className="mt-6 font-sans text-2xl font-bold text-white">{t.order.success}</h2>
                <p className="mt-2 text-ink-muted">{t.order.successMessage}</p>
                <div className="mt-8 flex gap-4">
                  <Button asChild className="bg-accent-dark text-white hover:bg-accent"><Link href="/account">{t.nav.myAccount}</Link></Button>
                  <Button variant="outline" asChild className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"><Link href="/products">{t.nav.products}</Link></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PublicLayout>
    )
  }

  const listPrice = product.listPrice

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-80px)] bg-navy">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:py-16">
          {draftRestored && (
            <div className="mb-4 flex items-center justify-between rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-white">
              <span>Draft restored from your last visit.</span>
              <button
                type="button"
                onClick={() => { clearDraft(); setDraftRestored(false) }}
                className="underline text-accent-light hover:text-white"
              >
                Discard draft
              </button>
            </div>
          )}

          <h1 className="font-sans text-3xl font-bold text-white sm:text-4xl">{t.order.title}</h1>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Left: Form */}
            <div className="space-y-6">
              {/* Selected Product */}
              <Card className="border border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-lg text-white">{t.order.selectedProduct}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-ink-faint">
                          {product.diameter}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      <p className="text-sm text-ink-muted">SKU: {product.sku}</p>
                      <p className="mt-1 font-mono text-lg font-bold text-accent-light">
                        {formatPrice(listPrice)} / unit
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quantity */}
              <Card className="border border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-lg text-white">{t.order.quantity}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      onBlur={handleDraftSave}
                      className="w-24 border-white/10 bg-white/5 text-center text-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery address is hidden on the order page by design
                  (GH 2026-05-16). Address comes from the contractor's
                  account record and is submitted silently. If missing,
                  the contractor is asked to update it in My Account. */}
              {!deliveryAddress && (
                <Card className="border border-warn/40 bg-warn/10">
                  <CardContent className="py-4 text-sm">
                    <p className="font-semibold text-warn">No delivery address on file.</p>
                    <p className="mt-1 text-ink-muted">
                      Please add your delivery address in{' '}
                      <Link href="/account" className="font-semibold text-accent-light underline hover:text-white">
                        My Account
                      </Link>{' '}
                      before submitting an order.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              <Card className="border border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-lg text-white">{t.order.notes}</CardTitle>
                  <CardDescription className="text-ink-muted">Optional</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    onBlur={handleDraftSave}
                    placeholder={t.order.notesPlaceholder}
                    rows={3}
                    className="resize-none border-white/10 bg-white/5 text-white placeholder:text-ink-faint"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:sticky lg:top-20 lg:h-fit">
              <Card className="border border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-white">{t.order.pricing}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stale price notice */}
                  {stalePriceInfo && (
                    <div className="rounded-lg border border-warn/40 bg-warn/10 p-3 text-sm text-warn">
                      <p className="font-semibold">Price has changed</p>
                      <p className="mt-1 text-ink-muted">
                        New effective total:{' '}
                        <span className="font-mono font-bold text-white">{formatPrice(stalePriceInfo.serverEffectiveTotal)}</span>
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={e => handleSubmit(e as unknown as React.FormEvent, stalePriceInfo.serverEffectiveTotal)}
                          className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                        >
                          Accept new price &amp; confirm
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setStalePriceInfo(null)}
                          className="text-white hover:bg-white/10 hover:text-white"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* List price row */}
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-muted">{t.order.listPrice} ({quantity}x)</span>
                    <span className="font-mono font-medium text-white">{formatPrice(listPrice * quantity)}</span>
                  </div>

                  {/* Tier discount row — verified contractors only */}
                  {showPriceBreakdown && tierDiscountPct > 0 && pricing && (
                    <div className="flex justify-between text-sm text-success">
                      <span>{t.order.tierDiscount} ({formatPercentage(tierDiscountPct)})</span>
                      <span className="font-mono">-{formatPrice(pricing.tierSaving * quantity)}</span>
                    </div>
                  )}

                  {/* Gate message for unverified / non-contractor */}
                  {!showPriceBreakdown && (
                    <div className="rounded bg-white/5 px-3 py-2 text-xs text-ink-muted">
                      {isContractor
                        ? 'Verify your email to place order.'
                        : 'Log in for your contract price.'}
                    </div>
                  )}

                  {/* Promo code field */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-widest text-ink-muted">{t.order.promoCode}</Label>
                    <div className="flex gap-2">
                      <Input
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value.toUpperCase())}
                        onBlur={handleDraftSave}
                        placeholder={t.order.promoCodePlaceholder}
                        className="border-white/10 bg-white/5 text-sm text-white placeholder:text-ink-faint"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!promoCode}
                        onClick={() => {
                          setPromoError('')
                          setAppliedPromoCode(promoCode)
                        }}
                        className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                      >
                        {t.order.applyPromo}
                      </Button>
                    </div>
                    {promoError && <p className="text-xs text-danger">{promoError}</p>}
                    {appliedPromoCode && (
                      <p className="text-xs text-success">
                        Code &quot;{appliedPromoCode}&quot; will be validated on submit.
                      </p>
                    )}
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Total */}
                  <div className="flex justify-between pt-2 text-lg font-bold">
                    <span className="text-white">{t.order.total}</span>
                    <span className="font-mono text-accent-light">
                      {showPriceBreakdown ? formatPrice(effectiveTotal) : formatPrice(listPrice * quantity)}
                    </span>
                  </div>

                  {/* Visual break so Total doesn't collide with status/submit (GH 2026-05-16) */}
                  <Separator className="mt-2 bg-white/10" />

                  {submitError && (
                    <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
                      {submitError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="mt-2 h-12 w-full bg-accent-dark text-white hover:bg-accent"
                    size="lg"
                    disabled={isSubmitting || !!stalePriceInfo || !deliveryAddress}
                  >
                    {isSubmitting ? t.order.submitting : t.order.submit}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </PublicLayout>
  )
}

