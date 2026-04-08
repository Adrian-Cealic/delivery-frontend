import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import StatusStepper from '@/components/StatusStepper'
import { deliveryService } from '@/services/deliveryService'
import { courierService } from '@/services/courierService'
import type { Delivery, Courier } from '@/types'

const DELIVERY_STEPS = ['Assigned', 'PickedUp', 'Delivered']

function statusVariant(s: string): 'success' | 'warning' | 'secondary' {
  if (s === 'Delivered') return 'success'
  if (s === 'PickedUp') return 'warning'
  return 'secondary'
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([deliveryService.getAll(), courierService.getAll()])
      .then(([d, c]) => { setDeliveries(d); setCouriers(c) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  const courierMap = Object.fromEntries(couriers.map(c => [c.id, c.name]))

  return (
    <div>
      <PageHeader
        title="Deliveries"
        description="Active and completed delivery tracking"
        actions={
          <div className="flex gap-2">
            <PatternBadge pattern="Facade" />
            <PatternBadge pattern="Decorator" />
          </div>
        }
      />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead>Delivery ID</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Courier</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.map(d => (
              <TableRow key={d.id} className="border-zinc-800/50">
                <TableCell className="font-mono text-[11px] text-zinc-500">{d.id.slice(0, 8)}…</TableCell>
                <TableCell className="font-mono text-[11px] text-zinc-400">{d.orderId.slice(0, 8)}…</TableCell>
                <TableCell className="text-zinc-300">{courierMap[d.courierId] ?? d.courierId.slice(0, 8)}</TableCell>
                <TableCell>
                  <StatusStepper steps={DELIVERY_STEPS} current={d.status} compact />
                </TableCell>
                <TableCell className="text-zinc-400">{d.distanceKm} km</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(d.status)}>{d.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {deliveries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-zinc-600 py-8">No deliveries found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
