import { useState } from 'react'
import { Repeat } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { iteratorService, type CourierIteratorResponse } from '@/services/lab6Service'

const MODES = [
  { key: 'insertion', label: 'Insertion order' },
  { key: 'available', label: 'Available only' },
  { key: 'vehicle', label: 'By vehicle' },
  { key: 'round-robin', label: 'Round-robin' },
]

const VEHICLES = ['Bicycle', 'Car', 'Drone']

export default function CourierIteratorPage() {
  const [mode, setMode] = useState('insertion')
  const [vehicleType, setVehicleType] = useState('Bicycle')
  const [steps, setSteps] = useState(8)
  const [result, setResult] = useState<CourierIteratorResponse | null>(null)
  const [error, setError] = useState('')

  async function run() {
    setError('')
    try {
      const res = await iteratorService.walk({
        mode,
        vehicleType: mode === 'vehicle' ? vehicleType : null,
        roundRobinSteps: mode === 'round-robin' ? steps : null,
      })
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Iterator failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Courier Iterator"
        description="Walk the courier collection in different orders — Iterator pattern"
        actions={<PatternBadge pattern="Iterator" />}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <Repeat className="h-4 w-4" /> Traversal mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MODES.map(m => (
              <button key={m.key} onClick={() => setMode(m.key)}
                className={`w-full rounded-md border px-2.5 py-1.5 text-left text-xs uppercase tracking-wider
                  ${mode === m.key
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-100'}`}>
                {m.label}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mode === 'vehicle' && (
              <div>
                <p className="mb-1 text-xs text-zinc-500">Vehicle type</p>
                <div className="flex flex-wrap gap-1">
                  {VEHICLES.map(v => (
                    <button key={v} onClick={() => setVehicleType(v)}
                      className={`rounded-md border px-2.5 py-1 text-[10px] uppercase tracking-wider
                        ${vehicleType === v
                          ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                          : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {mode === 'round-robin' && (
              <label className="block text-xs text-zinc-500">Total steps
                <Input type="number" min={1} value={steps}
                  onChange={e => setSteps(Number(e.target.value))}
                  className="mt-1 bg-zinc-950 border-zinc-800" />
              </label>
            )}
            {mode !== 'vehicle' && mode !== 'round-robin' && (
              <p className="text-xs text-zinc-500">No extra parameters needed for this mode.</p>
            )}
            <Button size="sm" onClick={run} className="w-full bg-indigo-600 hover:bg-indigo-500">Walk</Button>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Visited couriers</CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <p className="text-xs text-zinc-500">Run an iterator to see the visit order.</p>
            ) : result.courierNames.length === 0 ? (
              <p className="text-xs text-zinc-500">Iterator returned 0 couriers for this mode.</p>
            ) : (
              <ol className="space-y-1 max-h-96 overflow-y-auto list-decimal list-inside">
                {result.courierNames.map((name, idx) => (
                  <li key={idx} className="text-sm text-zinc-200 marker:text-zinc-600">{name}</li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
