import { useEffect, useState } from 'react'
import { GitFork, AlertTriangle } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { stateService, type StateSnapshot } from '@/services/lab7Service'

const STATES = ['Pending', 'Assigned', 'PickedUp', 'InTransit', 'Delivered', 'Failed']

export default function DeliveryStatePage() {
  const [snapshot, setSnapshot] = useState<StateSnapshot | null>(null)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  async function refresh() {
    try {
      const s = await stateService.current()
      setSnapshot(s)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    }
  }

  useEffect(() => { refresh() }, [])

  async function apply(action: string) {
    setError('')
    try {
      const s = await stateService.apply(action, action === 'fail' ? reason || 'manual fail' : undefined)
      setSnapshot(s)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action rejected')
    }
  }

  return (
    <div>
      <PageHeader
        title="Delivery State"
        description="Drive a delivery through its lifecycle states — State pattern"
        actions={<PatternBadge pattern="State" />}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <GitFork className="h-4 w-4" /> State diagram
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              {STATES.map((s, i) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className={`rounded-md border px-2.5 py-1 text-xs uppercase tracking-wider
                    ${snapshot?.currentState === s
                      ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200'
                      : 'border-zinc-800 text-zinc-500'}`}>
                    {s}
                  </span>
                  {i < STATES.length - 2 && <span className="text-zinc-700">→</span>}
                  {i === STATES.length - 2 && <span className="text-zinc-700">/</span>}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['assign', 'pickup', 'transit', 'complete'].map(a => (
                <Button key={a} size="sm" onClick={() => apply(a)}
                  disabled={snapshot?.isTerminal}
                  className="bg-indigo-600 hover:bg-indigo-500 capitalize">{a}</Button>
              ))}
              <div className="col-span-3 flex gap-2 mt-2">
                <Input value={reason} onChange={e => setReason(e.target.value)}
                  placeholder="Failure reason"
                  className="bg-zinc-950 border-zinc-800" />
                <Button size="sm" variant="outline" onClick={() => apply('fail')}
                  disabled={snapshot?.isTerminal}
                  className="border-red-500/40 text-red-300 hover:bg-red-500/10 gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" /> Fail
                </Button>
              </div>
            </div>
            {error && <p className="mt-2 text-xs text-red-400 font-mono">{error}</p>}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Current snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            {snapshot ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary">{snapshot.currentState}</Badge>
                  {snapshot.isTerminal && (
                    <span className="text-[10px] text-amber-400 uppercase tracking-wider">Terminal</span>
                  )}
                </div>
                {snapshot.failureReason && (
                  <p className="mb-3 text-xs text-red-400">Reason: {snapshot.failureReason}</p>
                )}
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Trace</p>
                <ul className="space-y-1 max-h-64 overflow-y-auto">
                  {snapshot.trace.map((t, i) => (
                    <li key={i} className="text-[11px] font-mono text-zinc-400">{t}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-xs text-zinc-500">Loading…</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
