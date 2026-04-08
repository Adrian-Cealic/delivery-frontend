import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { courierService } from '@/services/courierService'
import type { Courier } from '@/types'

function vehicleVariant(v: string): 'indigo' | 'success' | 'warning' | 'secondary' {
  if (v === 'Bicycle') return 'indigo'
  if (v === 'Car') return 'success'
  if (v === 'Drone') return 'warning'
  return 'secondary'
}

function statusVariant(available: boolean): 'success' | 'secondary' {
  return available ? 'success' : 'secondary'
}

export default function CouriersPage() {
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    courierService.getAll()
      .then(setCouriers)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  return (
    <div>
      <PageHeader
        title="Couriers"
        description="Fleet management — vehicle factory and flyweight metadata"
        actions={
          <div className="flex gap-2">
            <PatternBadge pattern="Factory Method" />
            <PatternBadge pattern="Flyweight" />
          </div>
        }
      />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Max Weight</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {couriers.map(c => (
              <TableRow key={c.id} className="border-zinc-800/50">
                <TableCell className="font-medium text-zinc-200">{c.name}</TableCell>
                <TableCell className="text-zinc-400">{c.phone}</TableCell>
                <TableCell>
                  <Badge variant={vehicleVariant(c.vehicleType)}>{c.vehicleType}</Badge>
                </TableCell>
                <TableCell className="text-zinc-400">{c.maxWeight} kg</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(c.isAvailable)}>
                    {c.isAvailable ? 'Available' : 'Busy'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {couriers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-600 py-8">No couriers found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
