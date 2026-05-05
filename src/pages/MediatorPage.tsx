import { useEffect, useState } from 'react'
import { Network, Users, MessageCircle, Send } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mediatorService, type MediatorBroadcast } from '@/services/lab7Service'

export default function MediatorPage() {
  const [state, setState] = useState<MediatorBroadcast | null>(null)
  const [orderName, setOrderName] = useState('ord-100')
  const [courierName, setCourierName] = useState('Alex')
  const [error, setError] = useState('')

  async function refresh() {
    try {
      const s = await mediatorService.state()
      setState(s)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    }
  }

  useEffect(() => { refresh() }, [])

  async function register(kind: 'order' | 'courier', name: string) {
    setError('')
    try {
      const s = await mediatorService.register(kind, name)
      setState(s)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Register failed')
    }
  }

  async function dispatch() {
    setError('')
    try {
      const s = await mediatorService.dispatch(orderName)
      setState(s)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Dispatch failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Dispatch Mediator"
        description="Order, courier and notifier communicating only through a mediator — Mediator pattern"
        actions={<PatternBadge pattern="Mediator" />}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <Users className="h-4 w-4" /> Register participants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Order id</p>
              <div className="flex gap-2">
                <Input value={orderName} onChange={e => setOrderName(e.target.value)}
                  className="bg-zinc-950 border-zinc-800" />
                <Button size="sm" onClick={() => register('order', orderName)}
                  className="bg-indigo-600 hover:bg-indigo-500">Add</Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Courier name</p>
              <div className="flex gap-2">
                <Input value={courierName} onChange={e => setCourierName(e.target.value)}
                  className="bg-zinc-950 border-zinc-800" />
                <Button size="sm" onClick={() => register('courier', courierName)}
                  className="bg-indigo-600 hover:bg-indigo-500">Add</Button>
              </div>
            </div>
            <Button size="sm" onClick={dispatch}
              className="w-full bg-emerald-600 hover:bg-emerald-500 gap-1.5">
              <Send className="h-3.5 w-3.5" /> Dispatch order
            </Button>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <Network className="h-4 w-4" /> Mediator log
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!state || state.log.length === 0 ? (
              <p className="text-xs text-zinc-500">No traffic yet — register participants and dispatch.</p>
            ) : (
              <ul className="space-y-1 max-h-80 overflow-y-auto">
                {state.log.map((entry, i) => (
                  <li key={i} className={`text-[11px] font-mono ${
                    entry.startsWith('REGISTER') ? 'text-zinc-500' : 'text-zinc-300'
                  }`}>{entry}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" /> Customer notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Registered</p>
            <ul className="mb-3 space-y-0.5">
              {state?.registered.map(r => (
                <li key={r} className="text-[11px] font-mono text-zinc-400">{r}</li>
              ))}
            </ul>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Notifier emitted</p>
            {!state || state.notifierEmitted.length === 0 ? (
              <p className="text-xs text-zinc-500">No customer-facing messages yet.</p>
            ) : (
              <ul className="space-y-1 max-h-56 overflow-y-auto">
                {state.notifierEmitted.map((m, i) => (
                  <li key={i} className="text-xs text-emerald-300">{m}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
