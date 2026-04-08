import { useEffect, useState } from 'react'
import { Package, TrendingUp, Clock, DollarSign, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import KpiCard from '@/components/KpiCard'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { orderService } from '@/services/orderService'
import { courierService } from '@/services/courierService'
import type { Order, Courier } from '@/types'

/* Bridge: renderer implementations */
function TableRenderer({ orders }: { orders: Order[] }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-zinc-800">
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Total (RON)</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.slice(0, 20).map(o => (
            <TableRow key={o.id} className="border-zinc-800/50">
              <TableCell className="font-mono text-xs text-zinc-500">{o.id.slice(0, 8)}…</TableCell>
              <TableCell><Badge variant="secondary">{o.status}</Badge></TableCell>
              <TableCell className="text-zinc-400">{o.priority}</TableCell>
              <TableCell className="text-zinc-300">{o.totalPrice.toFixed(2)}</TableCell>
              <TableCell className="text-zinc-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-zinc-600 py-8">No orders</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function BarRenderer({ orders }: { orders: Order[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const label = d.toLocaleDateString('en', { weekday: 'short' })
    const count = orders.filter(o => new Date(o.createdAt).toDateString() === d.toDateString()).length
    return { label, count }
  })
  const max = Math.max(...days.map(d => d.count), 1)

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Orders per day (last 7)</p>
      <div className="flex items-end gap-3 h-32">
        {days.map(d => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs text-zinc-400">{d.count}</span>
            <div
              className="w-full rounded-t bg-indigo-500"
              style={{ height: `${Math.max((d.count / max) * 100, 4)}%` }}
            />
            <span className="text-[10px] text-zinc-600">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DonutRenderer({ orders }: { orders: Order[] }) {
  const delivered = orders.filter(o => o.status === 'Delivered').length
  const inTransit = orders.filter(o => ['Processing', 'ReadyForDelivery'].includes(o.status)).length
  const failed = orders.filter(o => o.status === 'Cancelled').length
  const total = orders.length || 1

  const segments = [
    { label: 'Delivered', count: delivered, pct: ((delivered / total) * 100).toFixed(0), color: 'bg-indigo-500' },
    { label: 'In Transit', count: inTransit, pct: ((inTransit / total) * 100).toFixed(0), color: 'bg-emerald-500' },
    { label: 'Cancelled', count: failed, pct: ((failed / total) * 100).toFixed(0), color: 'bg-red-500' },
  ]

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 flex items-center gap-8">
      <div
        className="h-28 w-28 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(
            #6366f1 0% ${(delivered / total) * 100}%,
            #22c55e ${(delivered / total) * 100}% ${((delivered + inTransit) / total) * 100}%,
            #ef4444 ${((delivered + inTransit) / total) * 100}% 100%
          )`,
        }}
      />
      <div className="space-y-2">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <div className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
            <span className="text-zinc-400">{s.label}</span>
            <span className="font-semibold text-zinc-200">{s.pct}%</span>
            <span className="text-zinc-600 text-xs">({s.count})</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [_couriers, setCouriers] = useState<Courier[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([orderService.getAll(), courierService.getAll()])
      .then(([o, c]) => { setOrders(o); setCouriers(c) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  const delivered = orders.filter(o => o.status === 'Delivered').length
  const deliveryRate = orders.length ? ((delivered / orders.length) * 100).toFixed(1) : '0'
  const revenue = orders.reduce((s, o) => s + o.totalPrice, 0)

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Analytics and statistics — Bridge renderer pattern"
        actions={
          <div className="flex items-center gap-2">
            <PatternBadge pattern="Bridge" />
            <Button variant="outline" size="sm" className="h-8 border-zinc-700 text-xs gap-1.5">
              <Download className="h-3 w-3" /> Export CSV
            </Button>
          </div>
        }
      />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Orders" value={orders.length} delta="+12% vs last month" deltaUp icon={Package} />
        <KpiCard title="Delivery Rate" value={`${deliveryRate}%`} deltaUp icon={TrendingUp} />
        <KpiCard title="Avg Delivery Time" value="24 min" icon={Clock} />
        <KpiCard title="Revenue" value={`RON ${revenue.toFixed(0)}`} delta="+8.7%" deltaUp icon={DollarSign} />
      </div>

      <div className="mb-1 flex items-center gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Renderer (Bridge abstraction):</p>
      </div>
      <Tabs defaultValue="table" className="mt-0">
        <TabsList className="mb-4 bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="table" className="text-xs">Table</TabsTrigger>
          <TabsTrigger value="bar" className="text-xs">Bar Chart</TabsTrigger>
          <TabsTrigger value="donut" className="text-xs">Donut</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <TableRenderer orders={orders} />
        </TabsContent>
        <TabsContent value="bar">
          <BarRenderer orders={orders} />
        </TabsContent>
        <TabsContent value="donut">
          <DonutRenderer orders={orders} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
