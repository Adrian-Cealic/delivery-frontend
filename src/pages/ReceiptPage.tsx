import { useEffect, useState } from 'react'
import { FileText, Receipt as ReceiptIcon, RotateCw } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { receiptService, type ReceiptResponse } from '@/services/lab7Service'
import { orderService } from '@/services/orderService'
import { deliveryService } from '@/services/deliveryService'
import type { Order, Delivery } from '@/types'

const KINDS: { key: 'order' | 'delivery' | 'refund'; label: string }[] = [
  { key: 'order', label: 'Order' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'refund', label: 'Refund' },
]

export default function ReceiptPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [kind, setKind] = useState<'order' | 'delivery' | 'refund'>('order')
  const [id, setId] = useState<string>('')
  const [refundAmount, setRefundAmount] = useState(10)
  const [refundReason, setRefundReason] = useState('damaged box')
  const [response, setResponse] = useState<ReceiptResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([orderService.getAll(), deliveryService.getAll()])
      .then(([o, d]) => {
        setOrders(o); setDeliveries(d)
        if (o.length > 0) setId(o[0].id)
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Load failed'))
  }, [])

  useEffect(() => {
    if (kind === 'delivery' && deliveries.length > 0) setId(deliveries[0].id)
    if ((kind === 'order' || kind === 'refund') && orders.length > 0) setId(orders[0].id)
  }, [kind])

  async function generate() {
    setError('')
    try {
      const r = await receiptService.generate({
        kind, id,
        refundAmount: kind === 'refund' ? refundAmount : null,
        refundReason: kind === 'refund' ? refundReason : null,
      })
      setResponse(r)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generate failed')
    }
  }

  const list = kind === 'delivery' ? deliveries : orders

  return (
    <div>
      <PageHeader
        title="Receipts"
        description="Three receipt formats sharing one template algorithm — Template Method"
        actions={<PatternBadge pattern="Template Method" />}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <ReceiptIcon className="h-4 w-4" /> Receipt kind
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {KINDS.map(k => (
              <button key={k.key} onClick={() => setKind(k.key)}
                className={`w-full rounded-md border px-2.5 py-1.5 text-left text-xs uppercase tracking-wider
                  ${kind === k.key
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-100'}`}>
                {k.label}
              </button>
            ))}

            <div className="border-t border-zinc-800 pt-2">
              <p className="text-xs text-zinc-500 mb-1">{kind === 'delivery' ? 'Delivery' : 'Order'}</p>
              <select value={id} onChange={e => setId(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200">
                {list.map(item => (
                  <option key={item.id} value={item.id}>{item.id.slice(0, 8)}…</option>
                ))}
              </select>
            </div>

            {kind === 'refund' && (
              <div className="space-y-2 border-t border-zinc-800 pt-2">
                <label className="block text-xs text-zinc-500">Refund amount
                  <Input type="number" min={0.01} step="0.01" value={refundAmount}
                    onChange={e => setRefundAmount(Number(e.target.value))}
                    className="mt-1 bg-zinc-950 border-zinc-800" />
                </label>
                <label className="block text-xs text-zinc-500">Reason
                  <Input value={refundReason} onChange={e => setRefundReason(e.target.value)}
                    className="mt-1 bg-zinc-950 border-zinc-800" />
                </label>
              </div>
            )}

            <Button size="sm" onClick={generate} disabled={!id}
              className="w-full bg-indigo-600 hover:bg-indigo-500 gap-1.5">
              <RotateCw className="h-3.5 w-3.5" /> Generate
            </Button>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Generated receipt
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!response ? (
              <p className="text-xs text-zinc-500">Pick a kind and generate to view the receipt body.</p>
            ) : (
              <pre className="rounded-md bg-zinc-950 border border-zinc-800 p-4 text-[11px] font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed">
{response.body}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
