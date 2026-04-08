import { useEffect, useState } from 'react'
import { ShieldCheck, ShieldAlert, ShieldOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { orderService } from '@/services/orderService'
import { customerService } from '@/services/customerService'
import type { Order, Customer } from '@/types'
import { cn } from '@/lib/utils'

type Role = 'Admin' | 'Courier' | 'None'

/* Proxy: access control check */
function proxyAccess(role: Role, orderId: string): boolean {
  if (role === 'Admin') return true
  if (role === 'Courier') return orderId.charCodeAt(0) % 2 === 0
  return false
}

export default function ProtectedOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [role, setRole] = useState<Role>('None')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([orderService.getAll(), customerService.getAll()])
      .then(([o, c]) => { setOrders(o); setCustomers(c) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  const customerMap = Object.fromEntries(customers.map(c => [c.id, c.name]))
  const visible = orders.filter(o => proxyAccess(role, o.id))

  return (
    <div>
      <PageHeader
        title="Protected Orders"
        description="Role-based access via Proxy pattern"
        actions={<PatternBadge pattern="Proxy" />}
      />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="mb-6 flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Role:</span>
        {(['Admin', 'Courier', 'None'] as Role[]).map(r => (
          <Button
            key={r}
            onClick={() => setRole(r)}
            variant="outline"
            size="sm"
            className={cn(
              'h-8 gap-1.5 border text-xs transition-colors',
              role === r
                ? r === 'Admin'
                  ? 'border-orange-500 bg-orange-500/15 text-orange-300'
                  : r === 'Courier'
                  ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'
            )}
          >
            {r === 'Admin' && <ShieldCheck className="h-3 w-3" />}
            {r === 'Courier' && <ShieldAlert className="h-3 w-3" />}
            {r === 'None' && <ShieldOff className="h-3 w-3" />}
            {r}
          </Button>
        ))}
      </div>

      {role === 'None' ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-orange-900/40 bg-orange-950/20 py-16">
          <ShieldOff className="h-8 w-8 text-orange-600 mb-3" />
          <p className="text-sm font-semibold text-orange-400">Access Denied</p>
          <p className="mt-1 text-xs text-zinc-600">Select a role to view orders. Proxy blocked this request.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900">
          {role === 'Admin' && (
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-orange-950/10 px-4 py-2">
              <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-xs text-orange-400 font-medium">Admin view — all columns visible including sensitive data</span>
            </div>
          )}
          {role === 'Courier' && (
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-indigo-950/10 px-4 py-2">
              <ShieldAlert className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-xs text-indigo-400 font-medium">Courier view — assigned orders only, customer contact redacted</span>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-800">
                <TableHead>Order ID</TableHead>
                {role === 'Admin' && <TableHead>Customer</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Total</TableHead>
                {role === 'Admin' && <TableHead>Notes</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map(o => (
                <TableRow key={o.id} className="border-zinc-800/50">
                  <TableCell className="font-mono text-xs text-zinc-500">{o.id.slice(0, 8)}…</TableCell>
                  {role === 'Admin' && (
                    <TableCell className="text-zinc-300">{customerMap[o.customerId] ?? '—'}</TableCell>
                  )}
                  <TableCell><Badge variant="secondary">{o.status}</Badge></TableCell>
                  <TableCell className="text-zinc-400">{o.priority}</TableCell>
                  <TableCell className="text-zinc-300">RON {o.totalPrice.toFixed(2)}</TableCell>
                  {role === 'Admin' && (
                    <TableCell className="text-zinc-500 text-xs">{o.deliveryNotes ?? '—'}</TableCell>
                  )}
                </TableRow>
              ))}
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={role === 'Admin' ? 6 : 4} className="text-center text-zinc-600 py-8">
                    No orders accessible with this role
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
