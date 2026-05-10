'use client'

import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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
import { getProductById } from '@/lib/data/products'

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

function OrderRequestContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product')
  const { t } = useLanguage()
  const { user, isAuthenticated, isLoading: authLoading, isContractor } = useAuth()

  const product = productId ? getProductById(productId) : undefined

  // Idempotency key — generated once on mount, never changes
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID())

  const [quantity, setQuantity] = useState(1)
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
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">{t.common.loading}</p>
        </div>
      </PublicLayout>
    )
  }

  if (!isAuthenticated) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-2xl px-4 py-12">
          <Alert className="border-border/30 bg-muted/30">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t.order.loginRequired}</AlertTitle>
            <AlertDescription className="mt-2">{t.order.loginToOrder}</AlertDescription>
          </Alert>
          <div className="mt-6 flex gap-4">
            <Button asChild><Link href="/auth/login">{t.nav.login}</Link></Button>
            <Button variant="outline" asChild><Link href="/auth/register">{t.nav.register}</Link></Button>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-2xl px-4 py-12">
          <Alert className="border-border/30 bg-muted/30">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Product Selected</AlertTitle>
            <AlertDescription className="mt-2">
              Please select a product from our catalogue to place an order.
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button asChild><Link href="/products">{t.hero.cta}</Link></Button>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (submitSuccess) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-2xl px-4 py-12">
          <Card className="border-border/30">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <Check className="h-8 w-8 text-success" />
              </div>
              <h2 className="mt-6 font-sans text-2xl font-bold text-white">{t.order.success}</h2>
              <p className="mt-2 text-muted-foreground">{t.order.successMessage}</p>
              <div className="mt-8 flex gap-4">
                <Button asChild><Link href="/account">{t.nav.myAccount}</Link></Button>
                <Button variant="outline" asChild><Link href="/products">{t.nav.products}</Link></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    )
  }

  const listPrice = product.listPrice

  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 lg:py-16">
        {draftRestored && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent-light">
            <span>Draft restored from your last visit.</span>
            <button
              type="button"
              onClick={() => { clearDraft(); setDraftRestored(false) }}
              className="underline"
            >
              Discard draft
            </button>
          </div>
        )}

        <h1 className="font-sans text-3xl font-bold text-white">{t.order.title}</h1>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left: Form */}
          <div className="space-y-6">
            {/* Selected Product */}
            <Card className="border-border/30">
              <CardHeader>
                <CardTitle className="text-lg">{t.order.selectedProduct}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-border/30 bg-muted/50">
                    <span className="text-lg font-bold text-muted-foreground/50">{product.diameter}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    <p className="mt-1 font-mono text-lg font-bold text-accent">
                      {formatPrice(listPrice)} / unit
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity */}
            <Card className="border-border/30">
              <CardHeader>
                <CardTitle className="text-lg">{t.order.quantity}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    onBlur={handleDraftSave}
                    className="w-24 border-border/40 text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="border-border/30">
              <CardHeader>
                <CardTitle className="text-lg">{t.order.deliveryAddress}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  onBlur={handleDraftSave}
                  rows={3}
                  className="resize-none border-border/40"
                  required
                />
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-border/30">
              <CardHeader>
                <CardTitle className="text-lg">{t.order.notes}</CardTitle>
                <CardDescription>Optional</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  onBlur={handleDraftSave}
                  placeholder={t.order.notesPlaceholder}
                  rows={3}
                  className="resize-none border-border/40"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:sticky lg:top-20 lg:h-fit">
            <Card className="border-border/30">
              <CardHeader>
                <CardTitle>{t.order.pricing}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stale price notice */}
                {stalePriceInfo && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
                    <p className="font-semibold">Price has changed</p>
                    <p className="mt-1">
                      New effective total:{' '}
                      <span className="font-mono font-bold">{formatPrice(stalePriceInfo.serverEffectiveTotal)}</span>
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={e => handleSubmit(e as unknown as React.FormEvent, stalePriceInfo.serverEffectiveTotal)}
                      >
                        Accept new price &amp; confirm
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setStalePriceInfo(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* List price row */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.order.listPrice} ({quantity}x)</span>
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
                  <div className="rounded bg-white/5 px-3 py-2 text-xs text-muted-foreground">
                    {isContractor
                      ? 'Verify your email to unlock your contract price.'
                      : 'Log in for your contract price.'}
                  </div>
                )}

                {/* Promo code field */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-widest">{t.order.promoCode}</Label>
                  <div className="flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value.toUpperCase())}
                      onBlur={handleDraftSave}
                      placeholder={t.order.promoCodePlaceholder}
                      className="border-border/40 text-sm"
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
                    >
                      {t.order.applyPromo}
                    </Button>
                  </div>
                  {promoError && <p className="text-xs text-destructive">{promoError}</p>}
                  {appliedPromoCode && (
                    <p className="text-xs text-success">
                      Code &quot;{appliedPromoCode}&quot; will be validated on submit.
                    </p>
                  )}
                </div>

                <Separator className="bg-border/30" />

                {/* Total */}
                <div className="flex justify-between pt-2 text-lg font-bold">
                  <span className="text-white">{t.order.total}</span>
                  <span className="font-mono text-accent">
                    {showPriceBreakdown ? formatPrice(effectiveTotal) : formatPrice(listPrice * quantity)}
                  </span>
                </div>

                {submitError && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting || !!stalePriceInfo}
                >
                  {isSubmitting ? t.order.submitting : t.order.submit}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </PublicLayout>
  )
}

export default function OrderRequestPage() {
  return (
    <Suspense fallback={
      <PublicLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </PublicLayout>
    }>
      <OrderRequestContent />
    </Suspense>
  )
}
