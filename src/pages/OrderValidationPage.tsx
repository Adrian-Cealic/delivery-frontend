import { useState } from 'react'
import { ListChecks, CheckCircle2, XCircle, Plus } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { validationService, type ValidationLine, type OrderValidationResponse } from '@/services/lab7Service'

export default function OrderValidationPage() {
  const [lines, setLines] = useState<ValidationLine[]>([
    { productName: 'Pizza Margherita', quantity: 2, unitPrice: 15, weight: 0.5, inStock: 10 },
    { productName: 'Cola', quantity: 1, unitPrice: 5, weight: 0.3, inStock: 20 },
  ])
  const [distance, setDistance] = useState(12)
  const [wallet, setWallet] = useState(100)
  const [country, setCountry] = useState('RO')
  const [response, setResponse] = useState<OrderValidationResponse | null>(null)
  const [error, setError] = useState('')

  function addEmptyLine() {
    setLines([...lines, { productName: '', quantity: 1, unitPrice: 0, weight: 0, inStock: 0 }])
  }
  function updateLine(i: number, field: keyof ValidationLine, value: string | number) {
    const copy = [...lines]
    ;(copy[i] as Record<keyof ValidationLine, string | number>)[field] = value
    setLines(copy)
  }
  function removeLine(i: number) {
    setLines(lines.filter((_, idx) => idx !== i))
  }

  async function run() {
    setError('')
    try {
      const r = await validationService.validate({
        customerId: '00000000-0000-0000-0000-000000000001',
        lines: lines.filter(l => l.productName.trim() !== ''),
        distanceKm: distance,
        walletBalance: wallet,
        customerCountry: country,
      })
      setResponse(r)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Validation failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Order Validation"
        description="Run an order through a validation pipeline — Chain of Responsibility"
        actions={<PatternBadge pattern="Chain of Responsibility" />}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Order details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              {lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <Input className="col-span-3 bg-zinc-950 border-zinc-800"
                    value={line.productName} placeholder="Product"
                    onChange={e => updateLine(idx, 'productName', e.target.value)} />
                  <Input className="col-span-2 bg-zinc-950 border-zinc-800" type="number" min={0}
                    value={line.quantity} placeholder="Qty"
                    onChange={e => updateLine(idx, 'quantity', Number(e.target.value))} />
                  <Input className="col-span-2 bg-zinc-950 border-zinc-800" type="number" min={0} step="0.01"
                    value={line.unitPrice} placeholder="Price"
                    onChange={e => updateLine(idx, 'unitPrice', Number(e.target.value))} />
                  <Input className="col-span-2 bg-zinc-950 border-zinc-800" type="number" min={0} step="0.01"
                    value={line.weight} placeholder="Weight"
                    onChange={e => updateLine(idx, 'weight', Number(e.target.value))} />
                  <Input className="col-span-2 bg-zinc-950 border-zinc-800" type="number" min={0}
                    value={line.inStock} placeholder="Stock"
                    onChange={e => updateLine(idx, 'inStock', Number(e.target.value))} />
                  <button onClick={() => removeLine(idx)}
                    className="col-span-1 text-[10px] text-zinc-500 hover:text-red-400">×</button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addEmptyLine}
                className="border-zinc-800 text-zinc-400 hover:text-zinc-100 gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add line
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-zinc-800 pt-3">
              <label className="block text-xs text-zinc-500">Distance (km)
                <Input type="number" min={0} value={distance}
                  onChange={e => setDistance(Number(e.target.value))}
                  className="mt-1 bg-zinc-950 border-zinc-800" />
              </label>
              <label className="block text-xs text-zinc-500">Wallet balance
                <Input type="number" min={0} value={wallet}
                  onChange={e => setWallet(Number(e.target.value))}
                  className="mt-1 bg-zinc-950 border-zinc-800" />
              </label>
              <label className="block text-xs text-zinc-500">Country
                <Input value={country} onChange={e => setCountry(e.target.value.toUpperCase())}
                  maxLength={2} className="mt-1 bg-zinc-950 border-zinc-800" />
              </label>
            </div>

            <Button size="sm" onClick={run} className="bg-indigo-600 hover:bg-indigo-500 gap-1.5">
              <ListChecks className="h-3.5 w-3.5" /> Validate
            </Button>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Pipeline result</CardTitle>
          </CardHeader>
          <CardContent>
            {!response ? (
              <p className="text-xs text-zinc-500">Run the pipeline to see handler-by-handler results.</p>
            ) : (
              <>
                <div className={`mb-3 rounded-md border px-3 py-2
                  ${response.accepted
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-red-500/40 bg-red-500/10 text-red-200'}`}>
                  <p className="text-xs font-semibold">
                    {response.accepted ? 'ACCEPTED' : 'REJECTED'}
                  </p>
                </div>
                <ul className="space-y-1 max-h-80 overflow-y-auto">
                  {response.passes.map((p, i) => (
                    <li key={`p-${i}`} className="flex items-start gap-1.5 text-xs text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span className="font-mono">{p}</span>
                    </li>
                  ))}
                  {response.failures.map((f, i) => (
                    <li key={`f-${i}`} className="flex items-start gap-1.5 text-xs text-red-300">
                      <XCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span className="font-mono">{f}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
