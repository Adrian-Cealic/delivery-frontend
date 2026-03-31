import { useState, useEffect, type FormEvent } from 'react';
import { catalogService } from '../services/catalogService';
import { orderService } from '../services/orderService';
import { customerService } from '../services/customerService';
import PatternBanner from '../components/PatternBanner';
import type { CatalogNode, Customer, PlaceOrderItemDto } from '../types';

function CatalogTree({ node, depth = 0 }: { node: CatalogNode; depth?: number }) {
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div className="catalog-node" style={{ marginLeft: depth * 14 }}>
      <div className="catalog-node-row">
        <span style={{ fontSize: 13, color: hasChildren ? '#f59e0b' : '#64748b' }}>
          {hasChildren ? '▸' : '·'}
        </span>
        <span className="catalog-node-name">{node.name}</span>
        <span className="catalog-node-price">${node.totalPrice.toFixed(2)}</span>
        <span className="catalog-node-weight">{node.totalWeight.toFixed(2)} kg</span>
      </div>
      {hasChildren && node.children.map((child, i) => (
        <CatalogTree key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function PlaceOrderPage() {
  const [catalog, setCatalog] = useState<CatalogNode | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [paymentGateway, setPaymentGateway] = useState('PayPal');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [items, setItems] = useState<PlaceOrderItemDto[]>([
    { productName: '', quantity: 1, unitPrice: 0, weight: 0 },
  ]);

  const load = async () => {
    try {
      const [cat, cust] = await Promise.all([
        catalogService.getCatalog(),
        customerService.getAll(),
      ]);
      setCatalog(cat);
      setCustomers(cust);
      setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  };

  useEffect(() => { load(); }, []);

  const addItem = () => setItems([...items, { productName: '', quantity: 1, unitPrice: 0, weight: 0 }]);

  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const updateItem = (idx: number, field: keyof PlaceOrderItemDto, value: string | number) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validItems = items.filter(i => i.productName.trim() && i.quantity > 0 && i.unitPrice >= 0);
    if (validItems.length === 0) {
      setError('Add at least one valid item');
      return;
    }
    try {
      const result = await orderService.place({
        customerId,
        items: validItems,
        paymentGateway,
        deliveryNotes: deliveryNotes || undefined,
      });
      if (result.success) {
        setSuccess(`Order placed! ID: ${result.orderId}`);
        setItems([{ productName: '', quantity: 1, unitPrice: 0, weight: 0 }]);
        setDeliveryNotes('');
      } else {
        setError(result.message);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Place order failed');
    }
  };

  const GATEWAY_LABELS: Record<string, string> = {
    PayPal: '💳 PayPal',
    Stripe: '⚡ Stripe',
    GooglePay: '🔵 Google Pay',
  };

  return (
    <div>
      <div className="page-header">
        <h1>Place Order</h1>
        <p>Lab 4 — Structural patterns in action</p>
      </div>

      <PatternBanner
        patterns={[
          { name: 'Façade', type: 'structural' },
          { name: 'Adapter', type: 'structural' },
          { name: 'Composite', type: 'structural' },
        ]}
        description="Façade: OrderPlacementFacade hides order creation + payment + delivery in one call. Adapter: PayPal/Stripe/GooglePay each have different APIs, adapted to IPaymentGateway. Composite: catalog items form a tree — leaf nodes and groups share the same interface."
      />

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">✓ {success}</div>}

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Product Catalog</h3>
            <span className="badge" style={{ background: '#0c1f26', color: '#67e8f9', border: '1px solid #0e7490', fontSize: 10 }}>Composite</span>
          </div>
          {catalog ? (
            <div className="catalog-tree" style={{ maxHeight: 380, overflowY: 'auto' }}>
              <CatalogTree node={catalog} />
            </div>
          ) : (
            <div className="empty-state">Loading catalog...</div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Place Order via Façade</h3>
            <span className="badge" style={{ background: '#0c1f26', color: '#67e8f9', border: '1px solid #0e7490', fontSize: 10 }}>Façade</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Customer</label>
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                <option value="">Select customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Payment Gateway <span style={{ color: '#0e7490', fontSize: 10, fontWeight: 700 }}>ADAPTER</span></label>
              <select value={paymentGateway} onChange={e => setPaymentGateway(e.target.value)}>
                {Object.entries(GATEWAY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Delivery Notes</label>
              <input value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)} placeholder="Optional" />
            </div>
            <div className="items-section">
              <div className="items-section-label">Items</div>
              {items.map((item, idx) => (
                <div key={idx} className="item-entry">
                  <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                    <label>Product</label>
                    <input value={item.productName} onChange={e => updateItem(idx, 'productName', e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Qty</label>
                    <input type="number" min={1} value={item.quantity} onChange={e => updateItem(idx, 'quantity', +e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Price $</label>
                    <input type="number" min={0} step={0.01} value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', +e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Weight kg</label>
                    <input type="number" min={0} step={0.1} value={item.weight} onChange={e => updateItem(idx, 'weight', +e.target.value)} required />
                  </div>
                  {items.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeItem(idx)} style={{ alignSelf: 'flex-end' }}>✕</button>
                  )}
                </div>
              ))}
              <div className="btn-group" style={{ marginTop: 8 }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={addItem}>+ Add Item</button>
                <button type="submit" className="btn btn-success btn-sm">Place Order</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
