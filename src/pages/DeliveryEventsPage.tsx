import { useEffect, useState } from 'react'
import { Bell, Plus, Mail, MessageSquare } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { eventsService, type DeliveryEvent } from '@/services/lab6Service'
import { deliveryService } from '@/services/deliveryService'
import type { Delivery } from '@/types'

export default function DeliveryEventsPage() {
  const [channels, setChannels] = useState<string[]>([])
  const [events, setEvents] = useState<DeliveryEvent[]>([])
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')

  async function refresh() {
    try {
      const [c, e, d] = await Promise.all([
        eventsService.channels(),
        eventsService.events(),
        deliveryService.getAll(),
      ])
      setChannels(c)
      setEvents(e.slice().reverse())
      setDeliveries(d)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    }
  }

  useEffect(() => { refresh() }, [])

  async function subscribe(kind: 'email' | 'sms') {
    setError(''); setInfo('')
    try {
      const msg = kind === 'email'
        ? await eventsService.subscribeEmail(email)
        : await eventsService.subscribeSms(phone)
      setInfo(msg)
      if (kind === 'email') setEmail('')
      if (kind === 'sms') setPhone('')
      refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Subscribe failed')
    }
  }

  async function simulate(deliveryId: string, action: string) {
    setError(''); setInfo('')
    try {
      const msg = await eventsService.simulate(deliveryId, action)
      setInfo(msg)
      refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Simulation failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Delivery Events"
        description="Subjects, observers and notification channels — Observer pattern"
        actions={<PatternBadge pattern="Observer" />}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email channel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input value={email} placeholder="user@example.com"
              onChange={e => setEmail(e.target.value)}
              className="bg-zinc-950 border-zinc-800" />
            <Button size="sm" onClick={() => subscribe('email')} disabled={!email}
              className="bg-indigo-600 hover:bg-indigo-500 gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Subscribe
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> SMS channel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input value={phone} placeholder="+37312345678"
              onChange={e => setPhone(e.target.value)}
              className="bg-zinc-950 border-zinc-800" />
            <Button size="sm" onClick={() => subscribe('sms')} disabled={!phone}
              className="bg-indigo-600 hover:bg-indigo-500 gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Subscribe
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <Bell className="h-4 w-4" /> Attached observers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {channels.length === 0 ? (
              <p className="text-xs text-zinc-500">No subscribers yet.</p>
            ) : (
              <ul className="space-y-1">
                {channels.map(c => (
                  <li key={c} className="text-xs text-zinc-300 font-mono">{c}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {info && <p className="mb-3 text-xs text-emerald-400">{info}</p>}
      {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Trigger status change</CardTitle>
          </CardHeader>
          <CardContent>
            {deliveries.length === 0 ? (
              <p className="text-xs text-zinc-500">No deliveries available.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {deliveries.slice(0, 6).map(d => (
                  <div key={d.id} className="rounded-md border border-zinc-800 bg-zinc-950 p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-zinc-500">{d.id.slice(0, 8)}…</span>
                      <Badge variant="secondary">{d.status}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {['assign', 'pickup', 'transit', 'deliver'].map(a => (
                        <Button key={a} size="sm" variant="outline"
                          onClick={() => simulate(d.id, a)}
                          className="h-6 px-2 text-[10px] border-zinc-800 text-zinc-400 hover:text-zinc-100">
                          {a}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Recent events (newest first)</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-xs text-zinc-500">No events yet — trigger a status change.</p>
            ) : (
              <ul className="space-y-1.5 max-h-72 overflow-y-auto">
                {events.map((e, i) => (
                  <li key={`${e.at}-${i}`} className="text-xs text-zinc-400 font-mono">
                    <span className="text-zinc-600">{new Date(e.at).toLocaleTimeString()}</span>{' '}
                    {e.deliveryId.slice(0, 8)}…{' '}
                    <span className="text-zinc-500">{e.from}</span>
                    <span className="text-indigo-400"> → </span>
                    <span className="text-zinc-100">{e.to}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
