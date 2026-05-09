"use client"

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, AlertTriangle, Clock, Package, CheckCircle, ShoppingCart } from 'lucide-react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OrderStatusBadge } from '@/components/shared/status-badge'
import { useLanguage } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { getEnrichedOrders, type OrderStatus } from '@/lib/data/orders'
import { getDashboardStats } from '@/lib/data/analytics'
import { formatPrice, formatHours } from '@/lib/utils/formatting'
import { cn } from '@/lib/utils'

export default function AdminOrdersPage() {
  const { t } = useLanguage()
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/auth/login')
    }
  }, [isLoading, isAdmin, router])

  const allOrders = getEnrichedOrders()
  const stats = getDashboardStats()

  const filteredOrders = useMemo(() => {
    return allOrders.filter(order => {
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          order.id.toLowerCase().includes(query) ||
          order.contractor.companyName.toLowerCase().includes(query) ||
          order.product.name.toLowerCase().includes(query)
        )
      }
      
      return true
    })
  }, [allOrders, searchQuery, statusFilter])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" />
        </div>
      </AdminLayout>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">
            {t.admin.orders.title}
          </h1>
          <p className="mt-1 text-gray-400">Manage and track all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShoppingCart, value: stats.totalOrders, label: t.admin.orders.totalOrders, color: 'blue' },
            { icon: Clock, value: stats.pendingOrders, label: t.admin.orders.pendingOrders, color: 'amber' },
            { icon: Package, value: `${stats.avgResponseTimeHours}h`, label: t.admin.orders.avgResponseTime, color: 'cyan' },
            { icon: CheckCircle, value: stats.fulfilledToday, label: t.admin.orders.fulfilledToday, color: 'emerald' }
          ].map((stat, index) => (
            <div key={index} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl",
                  stat.color === 'blue' && 'bg-blue-500/10 text-blue-400',
                  stat.color === 'amber' && 'bg-amber-500/10 text-amber-400',
                  stat.color === 'cyan' && 'bg-cyan-500/10 text-cyan-400',
                  stat.color === 'emerald' && 'bg-emerald-500/10 text-emerald-400'
                )}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder={t.admin.orders.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | 'all')}>
            <SelectTrigger className="w-full border-white/10 bg-white/5 text-white sm:w-[180px]">
              <SelectValue placeholder={t.admin.orders.filterByStatus} />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0a1628]">
              <SelectItem value="all">{t.admin.orders.allStatuses}</SelectItem>
              <SelectItem value="Pending">{t.status.pending}</SelectItem>
              <SelectItem value="Acknowledged">{t.status.acknowledged}</SelectItem>
              <SelectItem value="Fulfilled">{t.status.fulfilled}</SelectItem>
              <SelectItem value="Cancelled">{t.status.cancelled}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              {t.admin.orders.title} ({filteredOrders.length})
            </h2>
          </div>
          
          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                  <ShoppingCart className="h-8 w-8 text-gray-500" />
                </div>
                <p className="mt-4 text-gray-400">{t.admin.orders.noOrders}</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        <th className="pb-4">ID</th>
                        <th className="pb-4">{t.admin.orders.contractor}</th>
                        <th className="pb-4">{t.admin.orders.product}</th>
                        <th className="pb-4 text-center">{t.admin.orders.quantity}</th>
                        <th className="pb-4 text-right">{t.admin.orders.total}</th>
                        <th className="pb-4">{t.admin.orders.status}</th>
                        <th className="pb-4">{t.admin.orders.responseTime}</th>
                        <th className="pb-4 text-right">{t.admin.orders.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredOrders.map((order) => (
                        <tr 
                          key={order.id}
                          className={cn(
                            "transition-colors hover:bg-white/[0.02]",
                            order.isUrgent && "border-l-2 border-l-red-500 bg-red-500/5"
                          )}
                        >
                          <td className="py-4 font-mono text-xs text-gray-400">{order.id}</td>
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-white">{order.contractor.companyName}</p>
                              <p className="text-xs text-gray-500">{order.contractor.contactName}</p>
                            </div>
                          </td>
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-white">{order.product.name}</p>
                              <p className="text-xs text-gray-500">{order.product.sku}</p>
                            </div>
                          </td>
                          <td className="py-4 text-center text-white">{order.quantity}</td>
                          <td className="py-4 text-right font-medium text-white">
                            {formatPrice(order.effectivePrice)}
                          </td>
                          <td className="py-4">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {order.isUrgent && (
                                <AlertTriangle className="h-4 w-4 text-red-400" />
                              )}
                              <span className={cn("text-sm", order.isUrgent ? "font-medium text-red-400" : "text-gray-400")}>
                                {order.responseTimeHours !== null ? formatHours(order.responseTimeHours) : '-'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {order.status === 'Pending' && (
                                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                  {t.admin.orders.acknowledge}
                                </Button>
                              )}
                              {order.status === 'Acknowledged' && (
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
                                  {t.admin.orders.fulfil}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-4 lg:hidden">
                  {filteredOrders.map((order) => (
                    <div 
                      key={order.id}
                      className={cn(
                        "rounded-xl border border-white/10 bg-white/[0.02] p-4",
                        order.isUrgent && "border-l-2 border-l-red-500"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-white">{order.contractor.companyName}</p>
                          <p className="text-xs text-gray-500">{order.contractor.contactName}</p>
                        </div>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      
                      <div className="mt-3 rounded-lg bg-white/[0.02] p-3">
                        <p className="font-medium text-white">{order.product.name}</p>
                        <p className="text-xs text-gray-500">{order.product.sku}</p>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">{t.admin.orders.quantity}</p>
                          <p className="font-medium text-white">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t.admin.orders.total}</p>
                          <p className="font-medium text-white">{formatPrice(order.effectivePrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t.admin.orders.responseTime}</p>
                          <div className="flex items-center gap-1">
                            {order.isUrgent && <AlertTriangle className="h-3 w-3 text-red-400" />}
                            <p className={cn("font-medium", order.isUrgent ? "text-red-400" : "text-white")}>
                              {order.responseTimeHours !== null ? formatHours(order.responseTimeHours) : '-'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {order.isUrgent && (
                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 p-2 text-xs text-red-400">
                          <AlertTriangle className="h-4 w-4" />
                          {t.admin.orders.urgentAlert}
                        </div>
                      )}

                      <div className="mt-4 flex gap-2">
                        {order.status === 'Pending' && (
                          <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                            {t.admin.orders.acknowledge}
                          </Button>
                        )}
                        {order.status === 'Acknowledged' && (
                          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-500">
                            {t.admin.orders.fulfil}
                          </Button>
                        )}
                        {(order.status === 'Pending' || order.status === 'Acknowledged') && (
                          <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10">
                            {t.admin.orders.cancel}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
