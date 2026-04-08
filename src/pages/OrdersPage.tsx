import { useEffect, useState } from 'react'
import { Copy, X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import StatusStepper from '@/components/StatusStepper'
import StatChip from '@/components/StatChip'
import { orderService } from '@/services/orderService'
import { customerService } from '@/services/customerService'
import type { Order, Customer } from '@/types'

const ORDER_STEPS = ['Created', 'Confirmed', 'Processing', 'ReadyForDelivery', 'Delivered']

function priorityVariant(p: string): 'warning' | 'destructive' | 'secondary' {
  if (p === 'High') return 'destructive'
  if (p === 'Normal') return 'secondary'
  return 'warning'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [error, setError] = useState('')

  const load = () =>
    Promise.all([orderService.getAll(), customerService.getAll()])
      .then(([o, c]) => { setOrders(o); setCustomers(c) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))

  useEffect(() => { load() }, [])

  const customerMap = Object.fromEntries(customers.map(c => [c.id, c.name]))

  const handleClone = async (id: string) => {
    try { await orderService.clone(id); load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Clone failed') }
  }

  const handleCancel = async (id: string) => {
    try { await orderService.cancel(id); load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Cancel failed') }
  }

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Manage and track all customer orders"
        actions={
          <div className="flex items-center gap-2">
            <PatternBadge pattern="Prototype" />
            <PatternBadge pattern="Builder" />
          </div>
        }
      />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {orders.map(order => (
          <Card key={order.id} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm text-zinc-100">
                    {customerMap[order.customerId] ?? 'Unknown Customer'}
                  </CardTitle>
                  <p className="mt-0.5 font-mono text-[10px] text-zinc-600">{order.id}</p>
                </div>
                <Badge variant={priorityVariant(order.priority)}>{order.priority}</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="mb-3 overflow-x-auto">
                <StatusStepper
                  steps={ORDER_STEPS}
                  current={order.status}
                  failed={order.status === 'Cancelled'}
                />
              </div>

              <div className="mb-3 flex flex-wrap gap-1.5">
                <StatChip label="items" value={order.items.length} color="default" />
                <StatChip label="RON" value={order.totalPrice.toFixed(2)} color="accent" />
                <StatChip label="kg" value={order.totalWeight.toFixed(1)} color="default" />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 border-zinc-700 text-xs">
                  <Eye className="h-3 w-3" /> View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 border-indigo-800 text-indigo-400 hover:bg-indigo-500/10 text-xs"
                  onClick={() => handleClone(order.id)}
                >
                  <Copy className="h-3 w-3" /> Clone
                </Button>
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-800 text-xs"
                    onClick={() => handleCancel(order.id)}
                  >
                    <X className="h-3 w-3" /> Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && (
          <p className="text-sm text-zinc-600 col-span-2 py-12 text-center">No orders found</p>
        )}
      </div>
    </div>
  )
}
