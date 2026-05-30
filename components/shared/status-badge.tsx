"use client"

import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/lib/i18n/context'
import type { OrderStatus } from '@/lib/data/orders'
import type { ContractorStatus } from '@/lib/data/contractors'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { t } = useLanguage()

  const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    Pending: { label: t.status.pending, variant: 'secondary' },
    Acknowledged: { label: t.status.acknowledged, variant: 'outline' },
    Fulfilled: { label: t.status.fulfilled, variant: 'default' },
    Cancelled: { label: t.status.cancelled, variant: 'destructive' },
  }

  const config = statusConfig[status]

  // These badges render on the dark navy account page. The shadcn `secondary`
  // and `outline` variants resolve to dark foreground text, which is invisible
  // on navy — so Pending/Acknowledged get explicit high-contrast tinted styles
  // using the project's own tokens (--warn amber, --accent blue). Fulfilled and
  // Cancelled already carry readable solid colours. Burned 2026-05-30: the old
  // Pending classes referenced a non-existent `warning` token and vanished.
  const className =
    status === 'Fulfilled'
      ? 'bg-success text-white hover:bg-success/90'
      : status === 'Pending'
      ? 'bg-warn/15 text-warn border-warn/40'
      : status === 'Acknowledged'
      ? 'bg-accent/15 text-accent-light border-accent/40'
      : ''

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}

interface ContractorStatusBadgeProps {
  status: ContractorStatus
}

export function ContractorStatusBadge({ status }: ContractorStatusBadgeProps) {
  const isActive = status === 'Active'

  return (
    <Badge 
      variant={isActive ? 'default' : 'secondary'}
      className={isActive ? 'bg-success text-white hover:bg-success/90' : 'bg-muted text-muted-foreground'}
    >
      {status}
    </Badge>
  )
}
