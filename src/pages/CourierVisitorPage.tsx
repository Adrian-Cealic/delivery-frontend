import { useState } from 'react'
import { Eye, Leaf, Wrench, Package } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { visitorService, type VisitorResponse } from '@/services/lab7Service'

const VISITORS: { key: string; label: string; icon: typeof Eye }[] = [
  { key: 'capacity', label: 'Capacity', icon: Package },
  { key: 'maintenance', label: 'Maintenance cost', icon: Wrench },
  { key: 'eco', label: 'Eco score', icon: Leaf },
]

export default function CourierVisitorPage() {
  const [active, setActive] = useState('capacity')
  const [response, setResponse] = useState<VisitorResponse | null>(null)
  const [error, setError] = useState('')

  async function run(visitor: string) {
    setActive(visitor)
    setError('')
    try {
      const r = await visitorService.run(visitor)
      setResponse(r)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Visitor failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Courier Visitor"
        description="Operations on the courier hierarchy without modifying entities — Visitor pattern"
        actions={<PatternBadge pattern="Visitor" />}
      />

      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <Eye className="h-4 w-4" /> Visitor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {VISITORS.map(v => {
              const Icon = v.icon
              const isActive = active === v.key
              return (
                <Button key={v.key} variant="outline" size="sm" onClick={() => run(v.key)}
                  className={`w-full justify-start gap-2 border-zinc-800
                    ${isActive ? 'bg-indigo-500/10 text-indigo-200 border-indigo-500/40' : 'text-zinc-300 hover:bg-zinc-800'}`}>
                  <Icon className="h-3.5 w-3.5" /> {v.label}
                </Button>
              )
            })}
            {error && <p className="text-xs text-red-400">{error}</p>}
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Result</CardTitle>
          </CardHeader>
          <CardContent>
            {!response ? (
              <p className="text-xs text-zinc-500">Pick a visitor on the left.</p>
            ) : response.rows.length === 0 ? (
              <p className="text-xs text-zinc-500">No couriers in the system yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-zinc-800">
                    <TableHead>Courier</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>{response.visitor}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {response.rows.map((row, i) => (
                    <TableRow key={i} className="border-zinc-800/50">
                      <TableCell className="text-zinc-200">{row.courier}</TableCell>
                      <TableCell><Badge variant="secondary">{row.vehicle}</Badge></TableCell>
                      <TableCell className="text-zinc-300">{row.result}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
