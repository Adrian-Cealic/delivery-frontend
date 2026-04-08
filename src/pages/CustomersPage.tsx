import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PageHeader from '@/components/PageHeader'
import { customerService } from '@/services/customerService'
import { orderService } from '@/services/orderService'
import type { Customer, Order } from '@/types'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([customerService.getAll(), orderService.getAll()])
      .then(([c, o]) => { setCustomers(c); setOrders(o) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  const orderCount = (id: string) => orders.filter(o => o.customerId === id).length

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader title="Customers" description="All registered customers" />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <Input
            placeholder="Search customers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 bg-zinc-900 border-zinc-800 text-zinc-300 placeholder:text-zinc-600 h-9"
          />
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id} className="border-zinc-800/50">
                <TableCell className="font-medium text-zinc-200">{c.name}</TableCell>
                <TableCell className="text-zinc-400">{c.email}</TableCell>
                <TableCell className="text-zinc-400">{c.phone}</TableCell>
                <TableCell className="text-zinc-500">{c.address.city}</TableCell>
                <TableCell>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                    {orderCount(c.id)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-600 py-8">No customers found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
