import { useEffect, useState } from 'react'
import { Package, Truck, Users, Clock } from 'lucide-react'
import KpiCard from '@/components/KpiCard'
import PageHeader from '@/components/PageHeader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { orderService } from '@/services/orderService'
import { customerService } from '@/services/customerService'
import { courierService } from '@/services/courierService'
import type { Order, Customer, Courier } from '@/types'

function statusVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' {
  const s = status.toLowerCase()
  if (s === 'delivered') return 'success'
  if (s === 'cancelled' || s === 'failed') return 'destructive'
  if (s === 'processing' || s === 'readyfordelivery') return 'warning'
  return 'secondary'
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([orderService.getAll(), customerService.getAll(), courierService.getAll()])
      .then(([o, c, cr]) => { setOrders(o); setCustomers(c); setCouriers(cr) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  const active = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length
  const inTransit = orders.filter(o => o.status === 'ReadyForDelivery').length
  const available = couriers.filter(c => c.isAvailable).length
  const recent = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10)

  const customerMap = Object.fromEntries(customers.map(c => [c.id, c.name]))

  return (
    <div>
      <PageHeader title="Dashboard" description="System overview" />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard title="Active Orders" value={active} delta="+12% vs last week" deltaUp icon={Package} />
        <KpiCard title="In Transit" value={inTransit} icon={Truck} />
        <KpiCard title="Available Couriers" value={available} icon={Users} />
        <KpiCard title="Avg Delivery Time" value="24 min" delta="+3 min" deltaUp={false} icon={Clock} />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">Recent Orders</h2>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-800">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map(order => (
                <TableRow key={order.id} className="border-zinc-800/50">
                  <TableCell className="font-mono text-xs text-zinc-400">{order.id.slice(0, 8)}…</TableCell>
                  <TableCell className="text-zinc-300">{customerMap[order.customerId] ?? order.customerId.slice(0, 8)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400">{order.priority}</TableCell>
                  <TableCell className="text-zinc-300">RON {order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-zinc-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {recent.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-zinc-600 py-8">No orders yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
