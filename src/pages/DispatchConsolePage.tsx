import { useEffect, useState } from 'react'
import { Undo2, Redo2, Trash2, Play } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { dispatchService, type CommandHistory } from '@/services/lab6Service'
import { deliveryService } from '@/services/deliveryService'
import type { Delivery } from '@/types'

const ACTIONS: { key: string; label: string }[] = [
  { key: 'assign', label: 'Assign' },
  { key: 'pickup', label: 'Pick up' },
  { key: 'transit', label: 'Transit' },
  { key: 'complete', label: 'Complete' },
]

export default function DispatchConsolePage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [history, setHistory] = useState<CommandHistory>({ history: [], canUndo: false, canRedo: false })
  const [error, setError] = useState('')

  async function refreshAll() {
    try {
      const [d, h] = await Promise.all([deliveryService.getAll(), dispatchService.history()])
      setDeliveries(d)
      setHistory(h)
      if (!selectedId && d.length > 0) setSelectedId(d[0].id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    }
  }

  useEffect(() => { refreshAll() }, [])

  async function execute(action: string) {
    if (!selectedId) return
    setError('')
    try {
      const h = await dispatchService.execute(selectedId, action)
      setHistory(h)
      const d = await deliveryService.getAll()
      setDeliveries(d)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Execute failed')
    }
  }

  async function undo() {
    setError('')
    try {
      const h = await dispatchService.undo()
      setHistory(h)
      const d = await deliveryService.getAll()
      setDeliveries(d)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Undo failed')
    }
  }

  async function redo() {
    setError('')
    try {
      const h = await dispatchService.redo()
      setHistory(h)
      const d = await deliveryService.getAll()
      setDeliveries(d)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Redo failed')
    }
  }

  async function clear() {
    setError('')
    try {
      await dispatchService.clear()
      const h = await dispatchService.history()
      setHistory(h)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Clear failed')
    }
  }

  const selected = deliveries.find(d => d.id === selectedId)

  return (
    <div>
      <PageHeader
        title="Dispatch Console"
        description="Run delivery commands with full undo / redo — Command pattern"
        actions={<PatternBadge pattern="Command" />}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Pick a delivery</CardTitle>
          </CardHeader>
          <CardContent>
            {deliveries.length === 0 ? (
              <p className="text-xs text-zinc-500">No deliveries available.</p>
            ) : (
              <div className="space-y-1.5 max-h-80 overflow-y-auto">
                {deliveries.map(d => (
                  <button key={d.id} onClick={() => setSelectedId(d.id)}
                    className={`w-full rounded-md border px-2.5 py-1.5 text-left
                      ${selectedId === d.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-zinc-400">{d.id.slice(0, 8)}…</span>
                      <Badge variant="secondary">{d.status}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <Play className="h-4 w-4" /> Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selected ? (
              <>
                <p className="mb-3 text-xs text-zinc-500">
                  Current status: <span className="text-zinc-200 font-semibold">{selected.status}</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ACTIONS.map(a => (
                    <Button key={a.key} size="sm" onClick={() => execute(a.key)}
                      className="bg-indigo-600 hover:bg-indigo-500">{a.label}</Button>
                  ))}
                </div>
                <div className="mt-4 flex gap-2 border-t border-zinc-800 pt-4">
                  <Button size="sm" variant="outline" onClick={undo} disabled={!history.canUndo}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-1.5">
                    <Undo2 className="h-3.5 w-3.5" /> Undo
                  </Button>
                  <Button size="sm" variant="outline" onClick={redo} disabled={!history.canRedo}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-1.5">
                    <Redo2 className="h-3.5 w-3.5" /> Redo
                  </Button>
                  <Button size="sm" variant="outline" onClick={clear}
                    className="ml-auto border-zinc-800 text-zinc-500 hover:text-red-400 gap-1.5">
                    <Trash2 className="h-3.5 w-3.5" /> Clear
                  </Button>
                </div>
                {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
              </>
            ) : (
              <p className="text-xs text-zinc-500">Select a delivery to begin.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Command history</CardTitle>
          </CardHeader>
          <CardContent>
            {history.history.length === 0 ? (
              <p className="text-xs text-zinc-500">No commands recorded yet.</p>
            ) : (
              <ul className="space-y-1 max-h-80 overflow-y-auto">
                {history.history.map((h, i) => {
                  const tag = h.startsWith('UNDO') ? 'text-amber-400'
                    : h.startsWith('REDO') ? 'text-emerald-400'
                    : 'text-zinc-300'
                  return (
                    <li key={i} className={`text-xs font-mono ${tag}`}>{h}</li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
