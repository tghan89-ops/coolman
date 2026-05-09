'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { getProductById } from '@/lib/data/products'
import { validatePromoCode, calculateOrderPrice } from '@/lib/data/orders'
import { formatPrice, formatPercentage } from '@/lib/utils/formatting'

function OrderRequestContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product')
  const { t } = useLanguage()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const product = productId ? getProductById(productId) : null

  const [quantity, setQuantity] = useState(1)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    if (user?.contractor?.deliveryAddress) {
      setDeliveryAddress(user.contractor.deliveryAddress)
    }
  }, [user])

  const accountDiscount = user?.contractor?.accountDiscount || 0

  const pricing = useMemo(() => {
    if (!product) return null
    return calculateOrderPrice(quantity, product.price, accountDiscount, promoDiscount)
  }, [product, quantity, accountDiscount, promoDiscount])

  const handleApplyPromo = () => {
    setPromoError('')
    setPromoSuccess(false)
    
    const discount = validatePromoCode(promoCode)
    if (discount !== null) {
      setPromoDiscount(discount)
      setPromoSuccess(true)
    } else {
      setPromoDiscount(0)
      setPromoError(t.order.invalidPromo)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitSuccess(true)
    setIsSubmitting(false)
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
            <AlertDescription className="mt-2">
              {t.order.loginToOrder}
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex gap-4">
            <Button asChild>
              <Link href="/auth/login">
                {t.nav.login}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/register">
                {t.nav.register}
              </Link>
            </Button>
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
            <Button asChild>
              <Link href="/products">
                {t.hero.cta}
              </Link>
            </Button>
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
              <h2 className="mt-6 font-playfair text-2xl font-bold">{t.order.success}</h2>
              <p className="mt-2 text-muted-foreground">{t.order.successMessage}</p>
              <div className="mt-8 flex gap-4">
                <Button asChild>
                  <Link href="/account">{t.nav.myAccount}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/products">{t.nav.products}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 lg:py-16">
        <h1 className="font-playfair text-3xl font-bold">{t.order.title}</h1>
        
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
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted/50 border border-border/30">
                    <span className="text-lg font-bold text-muted-foreground/50">
                      {product.diameter}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    <p className="mt-1 text-lg font-bold text-accent">
                      {formatPrice(product.price)} / unit
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
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 text-center border-border/40"
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
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={3}
                  className="border-border/40 resize-none"
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
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.order.notesPlaceholder}
                  rows={3}
                  className="border-border/40 resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right: Pricing Summary */}
          <div className="lg:sticky lg:top-20 lg:h-fit">
            <Card className="border-border/30">
              <CardHeader>
                <CardTitle>{t.order.pricing}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t.order.listPrice} ({quantity}x)
                  </span>
                  <span className="font-medium">{formatPrice(pricing?.subtotal || 0)}</span>
                </div>

                {/* Account Discount */}
                {accountDiscount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>{t.order.accountDiscount} ({formatPercentage(accountDiscount)})</span>
                    <span>-{formatPrice(pricing?.accountDiscountAmount || 0)}</span>
                  </div>
                )}

                {/* Promo Code */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-widest">{t.order.promoCode}</Label>
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
                      onClick={handleApplyPromo}
                      disabled={!promoCode}
                    >
                      Apply
                    </Button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-destructive">{promoError}</p>
                  )}
                  {promoSuccess && (
                    <p className="text-xs text-success">{t.order.promoApplied}</p>
                  )}
                </div>

                {/* Promo Discount */}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Promo ({formatPercentage(promoDiscount)})</span>
                    <span>-{formatPrice(pricing?.promoDiscountAmount || 0)}</span>
                  </div>
                )}

                <Separator className="bg-border/30" />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>{t.order.total}</span>
                  <span className="text-accent">{formatPrice(pricing?.total || 0)}</span>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
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
