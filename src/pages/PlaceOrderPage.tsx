import { useEffect, useState } from 'react'
import { ChevronRight, ChevronDown, Plus, Minus, CreditCard, Banknote, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { catalogService } from '@/services/catalogService'
import { customerService } from '@/services/customerService'
import { orderService } from '@/services/orderService'
import type { CatalogNode, Customer, PlaceOrderItemDto } from '@/types'
import { cn } from '@/lib/utils'

interface CartItem extends PlaceOrderItemDto {
  key: string
}

function CatalogTree({ node, onAdd, depth = 0 }: { node: CatalogNode; onAdd: (name: string, price: number) => void; depth?: number }) {
  const [open, setOpen] = useState(depth === 0)
  const isLeaf = node.children.length === 0

  if (isLeaf) {
    return (
      <div className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-zinc-800/50 group">
        <span className="text-sm text-zinc-400 group-hover:text-zinc-200">{node.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600">RON {node.totalPrice.toFixed(2)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-zinc-600 hover:text-indigo-400"
            onClick={() => onAdd(node.name, node.totalPrice)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-zinc-800/50"
        style={{ paddingLeft: `${8 + depth * 12}px` }}
        onClick={() => setOpen(o => !o)}
      >
        {open ? <ChevronDown className="h-3 w-3 text-zinc-600" /> : <ChevronRight className="h-3 w-3 text-zinc-600" />}
        <span className="text-sm font-medium text-zinc-300">{node.name}</span>
      </button>
      {open && (
        <div style={{ paddingLeft: `${depth * 12}px` }}>
          {node.children.map(child => (
            <CatalogTree key={child.name} node={child} onAdd={onAdd} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

type PaymentGateway = 'Cash' | 'Card' | 'DigitalWallet'

export default function PlaceOrderPage() {
  const [catalog, setCatalog] = useState<CatalogNode | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerId, setCustomerId] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [payment, setPayment] = useState<PaymentGateway>('Cash')
  const [cardNumber, setCardNumber] = useState('')
  const [walletId, setWalletId] = useState('')
  const [notes, setNotes] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([catalogService.getCatalog(), customerService.getAll()])
      .then(([c, custs]) => { setCatalog(c); setCustomers(custs) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  const addToCart = (name: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.productName === name)
      if (existing) return prev.map(i => i.productName === name ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { key: name, productName: name, quantity: 1, unitPrice: price, weight: 0.5 }]
    })
  }

  const removeFromCart = (name: string) => {
    setCart(prev => {
      const item = prev.find(i => i.productName === name)
      if (!item) return prev
      if (item.quantity > 1) return prev.map(i => i.productName === name ? { ...i, quantity: i.quantity - 1 } : i)
      return prev.filter(i => i.productName !== name)
    })
  }

  const total = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0)

  const handleSubmit = async () => {
    try {
      const res = await orderService.place({
        customerId,
        items: cart,
        paymentGateway: payment,
        deliveryNotes: notes || undefined,
      })
      setResult(res.success ? `Order placed: ${res.orderId?.slice(0, 8)}` : res.message)
      if (res.success) { setCart([]); setCustomerId(''); setNotes('') }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to place order')
    }
  }

  return (
    <div>
      <PageHeader
        title="Place Order"
        description="Composite catalog + Facade order service + Adapter payment"
        actions={
          <div className="flex gap-2">
            <PatternBadge pattern="Composite" />
            <PatternBadge pattern="Facade" />
            <PatternBadge pattern="Adapter" />
          </div>
        }
      />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {result && <p className="mb-4 text-sm text-emerald-400">{result}</p>}

      <div className="grid grid-cols-5 gap-6">
        <Card className="col-span-2 bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-300">Product Catalog</CardTitle>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Composite pattern</p>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            {catalog ? (
              <CatalogTree node={catalog} onAdd={addToCart} />
            ) : (
              <p className="text-center text-zinc-600 text-sm py-4">Loading…</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-300">Order Form</CardTitle>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Facade + Adapter</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">Customer</label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger className="bg-zinc-950 border-zinc-700 text-zinc-300">
                  <SelectValue placeholder="Select customer…" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {cart.length > 0 && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">Selected Items</label>
                <div className="space-y-1">
                  {cart.map(item => (
                    <div key={item.key} className="flex items-center justify-between rounded bg-zinc-950 px-3 py-1.5">
                      <span className="text-sm text-zinc-300">{item.productName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">RON {(item.unitPrice * item.quantity).toFixed(2)}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => removeFromCart(item.productName)} className="text-zinc-600 hover:text-zinc-300">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-4 text-center text-xs text-zinc-300">{item.quantity}</span>
                          <button onClick={() => addToCart(item.productName, item.unitPrice)} className="text-zinc-600 hover:text-zinc-300">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end px-3 pt-1">
                    <span className="text-sm font-semibold text-zinc-200">Total: RON {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">Payment Method (Adapter)</label>
              <div className="flex gap-2 mb-2">
                {(['Cash', 'Card', 'DigitalWallet'] as PaymentGateway[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setPayment(m)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors',
                      payment === m
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                        : 'border-zinc-700 text-zinc-500 hover:border-zinc-600'
                    )}
                  >
                    {m === 'Cash' && <Banknote className="h-3 w-3" />}
                    {m === 'Card' && <CreditCard className="h-3 w-3" />}
                    {m === 'DigitalWallet' && <Wallet className="h-3 w-3" />}
                    {m === 'DigitalWallet' ? 'Wallet' : m}
                  </button>
                ))}
              </div>
              {payment === 'Card' && (
                <Input
                  placeholder="Card number…"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="bg-zinc-950 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 h-8 text-xs"
                />
              )}
              {payment === 'DigitalWallet' && (
                <Input
                  placeholder="Wallet ID…"
                  value={walletId}
                  onChange={e => setWalletId(e.target.value)}
                  className="bg-zinc-950 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 h-8 text-xs"
                />
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">Delivery Notes (optional)</label>
              <Input
                placeholder="Leave at door…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="bg-zinc-950 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 h-8 text-xs"
              />
            </div>

            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
              disabled={!customerId || cart.length === 0}
              onClick={handleSubmit}
            >
              Place Order via Facade
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
