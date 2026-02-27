import { useState, useEffect, type FormEvent } from 'react';
import { catalogService } from '../services/catalogService';
import { orderService } from '../services/orderService';
import { customerService } from '../services/customerService';
import type { CatalogNode, Customer, PlaceOrderItemDto } from '../types';

function CatalogTree({ node, depth = 0 }: { node: CatalogNode; depth?: number }) {
  const hasChildren = node.children && node.children.length > 0;
  const indent = depth * 16;

  return (
    <div style={{ marginLeft: indent, marginBottom: 4 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13 }}>
        <span style={{ color: hasChildren ? '#f59e0b' : '#94a3b8' }}>
          {hasChildren ? '📁' : '📄'} {node.name}
        </span>
        <span style={{ color: '#64748b' }}>${node.totalPrice.toFixed(2)}</span>
        <span style={{ color: '#64748b', fontSize: 12 }}>{node.totalWeight.toFixed(2)} kg</span>
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
    (updated[idx] as Record<string, unknown>)[field] = value;
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

  return (
    <div>
      <div className="page-header">
        <h1>Place Order (Lab 4)</h1>
        <p>Façade: one-click order with payment. Adapter: PayPal, Stripe, Google Pay. Composite: catalog tree.</p>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg" style={{ background: '#064e3b', color: '#6ee7b7', padding: 12, borderRadius: 8, marginBottom: 16 }}>{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3>Catalog (Composite)</h3>
          </div>
          {catalog ? (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              <CatalogTree node={catalog} />
            </div>
          ) : (
            <div className="empty-state">Loading catalog...</div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Place Order (Façade)</h3>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: 0 }}>
            <div className="form-group">
              <label>Customer</label>
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                <option value="">Select customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Payment Gateway (Adapter)</label>
              <select value={paymentGateway} onChange={e => setPaymentGateway(e.target.value)}>
                <option value="PayPal">PayPal</option>
                <option value="Stripe">Stripe</option>
                <option value="GooglePay">Google Pay</option>
              </select>
            </div>
            <div className="form-group">
              <label>Delivery Notes</label>
              <input value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)} placeholder="Optional" />
            </div>
            <h4 style={{ margin: '12px 0 8px', fontSize: 14, color: '#94a3b8' }}>Items</h4>
            {items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'end' }}>
                <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                  <label>Product</label>
                  <input value={item.productName} onChange={e => updateItem(idx, 'productName', e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label>Qty</label>
                  <input type="number" min={1} value={item.quantity} onChange={e => updateItem(idx, 'quantity', +e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label>Price</label>
                  <input type="number" min={0} step={0.01} value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', +e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label>Weight</label>
                  <input type="number" min={0} step={0.1} value={item.weight} onChange={e => updateItem(idx, 'weight', +e.target.value)} required />
                </div>
                {items.length > 1 && (
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(idx)}>X</button>
                )}
              </div>
            ))}
            <div className="btn-group" style={{ marginTop: 12 }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={addItem}>+ Add Item</button>
              <button type="submit" className="btn btn-success">Place Order</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
