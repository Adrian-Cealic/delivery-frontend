import { useEffect, useState } from 'react'
import { Save, History, RotateCcw, Plus } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { draftService, type DraftSnapshot, type DraftState } from '@/services/lab6Service'

const PRIORITIES = ['Normal', 'Express', 'High']

export default function OrderDraftPage() {
  const [state, setState] = useState<DraftState | null>(null)
  const [snapshots, setSnapshots] = useState<DraftSnapshot[]>([])
  const [productName, setProductName] = useState('Pizza Margherita')
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState(15)
  const [weight, setWeight] = useState(0.5)
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')

  async function refresh() {
    try {
      const [s, snaps] = await Promise.all([draftService.state(), draftService.snapshots()])
      setState(s)
      setSnapshots(snaps)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    }
  }

  useEffect(() => { refresh() }, [])

  async function addLine() {
    setError('')
    try {
      const s = await draftService.addLine({ productName, quantity, unitPrice, weight })
      setState(s)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Add failed')
    }
  }

  async function removeLine(index: number) {
    setError('')
    try {
      await draftService.removeLine(index)
      refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Remove failed')
    }
  }

  async function setPriority(p: string) {
    setError('')
    try {
      const s = await draftService.setPriority(p)
      setState(s)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Priority failed')
    }
  }

  async function save() {
    if (!label.trim()) return
    setError('')
    try {
      const snaps = await draftService.save(label.trim())
      setSnapshots(snaps)
      setLabel('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  async function restore(snapshotLabel: string) {
    setError('')
    try {
      const s = await draftService.restore(snapshotLabel)
      setState(s)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Restore failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Order Draft"
        description="Build, snapshot and rewind your order — Memento pattern"
        actions={<PatternBadge pattern="Memento" />}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add line
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input value={productName} onChange={e => setProductName(e.target.value)}
              placeholder="Product name" className="bg-zinc-950 border-zinc-800" />
            <div className="grid grid-cols-3 gap-2">
              <Input type="number" min={1} value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="bg-zinc-950 border-zinc-800" placeholder="Qty" />
              <Input type="number" min={0} step="0.01" value={unitPrice}
                onChange={e => setUnitPrice(Number(e.target.value))}
                className="bg-zinc-950 border-zinc-800" placeholder="Price" />
              <Input type="number" min={0} step="0.01" value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className="bg-zinc-950 border-zinc-800" placeholder="Weight" />
            </div>
            <Button size="sm" onClick={addLine} className="w-full bg-indigo-600 hover:bg-indigo-500">Add line</Button>
            <p className="border-t border-zinc-800 pt-2 text-xs text-zinc-500">Priority</p>
            <div className="flex gap-1">
              {PRIORITIES.map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className={`rounded-md border px-2 py-1 text-[10px] uppercase tracking-wider
                    ${state?.priority === p
                      ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                      : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>
                  {p}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Current draft</CardTitle>
          </CardHeader>
          <CardContent>
            {!state || state.lines.length === 0 ? (
              <p className="text-xs text-zinc-500">Draft is empty.</p>
            ) : (
              <>
                <ul className="space-y-1 max-h-56 overflow-y-auto">
                  {state.lines.map((l, idx) => (
                    <li key={idx} className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5">
                      <div>
                        <p className="text-sm text-zinc-200">{l.productName}</p>
                        <p className="text-[10px] text-zinc-500">
                          {l.quantity} × {l.unitPrice.toFixed(2)} ({l.weight.toFixed(2)}kg)
                        </p>
                      </div>
                      <button onClick={() => removeLine(idx)}
                        className="text-[10px] text-zinc-500 hover:text-red-400">remove</button>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between border-t border-zinc-800 pt-3">
                  <Badge variant="secondary">{state.priority}</Badge>
                  <p className="text-sm font-semibold text-zinc-100">
                    Total: {state.total.toFixed(2)} RON
                  </p>
                </div>
              </>
            )}

            <div className="mt-4 flex gap-2 border-t border-zinc-800 pt-3">
              <Input value={label} onChange={e => setLabel(e.target.value)}
                placeholder="Snapshot label" className="bg-zinc-950 border-zinc-800" />
              <Button size="sm" onClick={save} disabled={!label.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 gap-1.5">
                <Save className="h-3.5 w-3.5" /> Save
              </Button>
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <History className="h-4 w-4" /> Snapshots
            </CardTitle>
          </CardHeader>
          <CardContent>
            {snapshots.length === 0 ? (
              <p className="text-xs text-zinc-500">No snapshots yet.</p>
            ) : (
              <ul className="space-y-1.5 max-h-96 overflow-y-auto">
                {[...snapshots].reverse().map(s => (
                  <li key={`${s.label}-${s.savedAt}`}
                    className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1.5">
                    <div>
                      <p className="text-sm text-zinc-200">{s.label}</p>
                      <p className="text-[10px] text-zinc-500">{new Date(s.savedAt).toLocaleTimeString()}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => restore(s.label)}
                      className="h-6 px-2 border-zinc-800 text-[10px] text-zinc-300 hover:text-indigo-300 gap-1.5">
                      <RotateCcw className="h-3 w-3" /> Restore
                    </Button>
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
