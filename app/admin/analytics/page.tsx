"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Download } from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ContractorStatusBadge } from '@/components/shared/status-badge'
import { useLanguage } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { 
  getFilteredAnalytics, 
  contractorActivityData,
  type DateRange 
} from '@/lib/data/analytics'
import { formatDate } from '@/lib/utils/formatting'

export default function AdminAnalyticsPage() {
  const { t } = useLanguage()
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()
  
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/auth/login')
    }
  }, [isLoading, isAdmin, router])

  const analytics = getFilteredAnalytics(dateRange)

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white lg:text-3xl">
              {t.admin.analytics.title}
            </h1>
            <p className="mt-1 text-ink-muted">Track performance and trends</p>
          </div>
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[160px] border-white/10 bg-white/5 text-white">
              <SelectValue placeholder={t.admin.analytics.dateRange} />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-navy">
              <SelectItem value="7d">{t.admin.analytics.last7Days}</SelectItem>
              <SelectItem value="30d">{t.admin.analytics.last30Days}</SelectItem>
              <SelectItem value="90d">{t.admin.analytics.last90Days}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Materials */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold text-white">{t.admin.analytics.topMaterials}</h2>
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart 
                  data={analytics.materialSearches} 
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="material" 
                    stroke="#6b7280" 
                    fontSize={12}
                    width={70}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a1628', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="searches" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Applications */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold text-white">{t.admin.analytics.topApplications}</h2>
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart 
                  data={analytics.applicationSearches} 
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="application" 
                    stroke="#6b7280" 
                    fontSize={12}
                    width={70}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a1628', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="searches" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart Row 2 */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-lg font-semibold text-white">{t.admin.analytics.viewsVsOrders}</h2>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart 
                data={analytics.productAnalytics.slice(0, 8)}
                margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="productName" 
                  stroke="#6b7280" 
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a1628', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value) => (
                    <span style={{ color: '#fff' }}>
                      {value === 'views' ? t.admin.analytics.views : t.admin.analytics.orders}
                    </span>
                  )}
                />
                <Bar dataKey="views" fill="#3b82f6" name="views" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" fill="#0a1628" stroke="#3b82f6" strokeWidth={2} name="orders" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contractor Activity */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">{t.admin.analytics.contractorActivity}</h2>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <Download className="mr-2 h-4 w-4" />
              {t.admin.analytics.export}
            </Button>
          </div>
          
          <div className="p-6">
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs font-medium uppercase tracking-wider text-ink-muted">
                    <th className="pb-4">{t.admin.analytics.contractor}</th>
                    <th className="pb-4">{t.admin.analytics.company}</th>
                    <th className="pb-4">{t.admin.analytics.lastOrder}</th>
                    <th className="pb-4 text-center">{t.admin.analytics.totalOrders}</th>
                    <th className="pb-4">{t.admin.analytics.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {contractorActivityData.map((contractor) => (
                    <tr key={contractor.contractorId} className="transition-colors hover:bg-white/[0.02]">
                      <td className="py-4 font-medium text-white">{contractor.contractorName}</td>
                      <td className="py-4 text-ink-muted">{contractor.companyName}</td>
                      <td className="py-4 text-ink-muted">
                        {contractor.lastOrderDate ? formatDate(contractor.lastOrderDate) : '-'}
                      </td>
                      <td className="py-4 text-center text-white">{contractor.totalOrders}</td>
                      <td className="py-4">
                        <ContractorStatusBadge status={contractor.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {contractorActivityData.map((contractor) => (
                <div key={contractor.contractorId} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-white">{contractor.contractorName}</p>
                      <p className="text-sm text-ink-muted">{contractor.companyName}</p>
                    </div>
                    <ContractorStatusBadge status={contractor.status} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-ink-muted">{t.admin.analytics.lastOrder}</p>
                      <p className="font-medium text-white">
                        {contractor.lastOrderDate ? formatDate(contractor.lastOrderDate) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-ink-muted">{t.admin.analytics.totalOrders}</p>
                      <p className="font-medium text-white">{contractor.totalOrders}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
