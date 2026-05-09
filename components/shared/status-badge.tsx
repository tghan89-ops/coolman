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

  return (
    <Badge variant={config.variant} className={
      status === 'Fulfilled' 
        ? 'bg-success text-white hover:bg-success/90' 
        : status === 'Pending'
        ? 'bg-warning/20 text-warning-foreground border-warning'
        : ''
    }>
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
