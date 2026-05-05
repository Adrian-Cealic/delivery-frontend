import { useEffect, useState } from 'react'
import { Calculator, Zap, Leaf, Truck } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { quoteService, type DeliveryQuoteResponse } from '@/services/lab6Service'

const STRATEGY_META: Record<string, { icon: typeof Truck; tone: string; label: string }> = {
  Standard: { icon: Truck, tone: 'text-zinc-300', label: 'Standard' },
  Express: { icon: Zap, tone: 'text-amber-400', label: 'Express' },
  Economy: { icon: Leaf, tone: 'text-emerald-400', label: 'Economy' },
}

export default function DeliveryQuotePage() {
  const [strategies, setStrategies] = useState<string[]>([])
  const [distance, setDistance] = useState(10)
  const [weight, setWeight] = useState(2)
  const [selected, setSelected] = useState('standard')
  const [result, setResult] = useState<DeliveryQuoteResponse | null>(null)
  const [comparison, setComparison] = useState<DeliveryQuoteResponse[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    quoteService.strategies().then(setStrategies).catch(e => setError(String(e)))
  }, [])

  async function quote() {
    setError('')
    try {
      const res = await quoteService.quote({ distanceKm: distance, weightKg: weight, strategy: selected })
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Quote failed')
    }
  }

  async function compare() {
    setError('')
    try {
      const res = await quoteService.compare({ distanceKm: distance, weightKg: weight, strategy: selected })
      setComparison(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Compare failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Delivery Quote"
        description="Pick a cost algorithm and switch it at runtime — Strategy pattern"
        actions={<PatternBadge pattern="Strategy" />}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-1 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <Calculator className="h-4 w-4" /> Quote inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="block text-xs text-zinc-500">Distance (km)
              <Input type="number" value={distance} min={0}
                onChange={e => setDistance(Number(e.target.value))}
                className="mt-1 bg-zinc-950 border-zinc-800" />
            </label>
            <label className="block text-xs text-zinc-500">Weight (kg)
              <Input type="number" value={weight} min={0}
                onChange={e => setWeight(Number(e.target.value))}
                className="mt-1 bg-zinc-950 border-zinc-800" />
            </label>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Strategy</p>
              <div className="flex flex-wrap gap-1">
                {strategies.map(s => (
                  <button key={s} onClick={() => setSelected(s)}
                    className={`rounded-md border px-2.5 py-1 text-xs uppercase tracking-wider
                      ${selected === s
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                        : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={quote} className="bg-indigo-600 hover:bg-indigo-500">Quote</Button>
              <Button size="sm" variant="outline" onClick={compare}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Compare all</Button>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Result</CardTitle>
          </CardHeader>
          <CardContent>
            {result && (
              <div className="rounded-md border border-indigo-500/40 bg-indigo-500/10 p-4 mb-4">
                <p className="text-[10px] uppercase tracking-wider text-indigo-300 mb-1">Selected strategy</p>
                <p className="text-2xl font-semibold text-zinc-50">{result.strategy}</p>
                <div className="mt-3 flex gap-6 text-sm text-zinc-300">
                  <span>Cost: <span className="font-semibold text-zinc-50">{result.cost.toFixed(2)} RON</span></span>
                  <span>ETA: <span className="font-semibold text-zinc-50">{result.etaMinutes.toFixed(0)} min</span></span>
                </div>
              </div>
            )}

            {comparison.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {comparison.map(c => {
                  const meta = STRATEGY_META[c.strategy] ?? STRATEGY_META.Standard
                  const Icon = meta.icon
                  return (
                    <div key={c.strategy} className="rounded-md border border-zinc-800 bg-zinc-950 p-3">
                      <Icon className={`h-4 w-4 ${meta.tone}`} />
                      <p className="mt-2 text-xs uppercase tracking-wider text-zinc-500">{meta.label}</p>
                      <p className="text-lg font-semibold text-zinc-50">{c.cost.toFixed(2)} RON</p>
                      <p className="text-xs text-zinc-500">{c.etaMinutes.toFixed(0)} min ETA</p>
                    </div>
                  )
                })}
              </div>
            )}

            {!result && comparison.length === 0 && (
              <p className="text-xs text-zinc-500">Run a quote to see costs and ETA from the selected strategy.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
