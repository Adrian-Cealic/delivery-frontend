import { useState, useEffect, type FormEvent } from 'react';
import { orderService } from '../services/orderService';
import { customerService } from '../services/customerService';
import type { Order, Customer, OrderItem } from '../types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<OrderItem[]>([{ productName: '', quantity: 1, unitPrice: 0, weight: 0 }]);

  const load = async () => {
    try {
      const [o, c] = await Promise.all([orderService.getAll(), customerService.getAll()]);
      setOrders(o);
      setCustomers(c);
      setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    }
  };

  useEffect(() => { load(); }, []);

  const addItem = () => setItems([...items, { productName: '', quantity: 1, unitPrice: 0, weight: 0 }]);

  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const updateItem = (idx: number, field: keyof OrderItem, value: string | number) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await orderService.create({ customerId, items });
      setShowForm(false);
      setItems([{ productName: '', quantity: 1, unitPrice: 0, weight: 0 }]);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create order');
    }
  };

  const handleAction = async (id: string, action: 'confirm' | 'process' | 'markReady' | 'cancel') => {
    try {
      await orderService[action](id);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Action failed');
    }
  };

  const customerName = (id: string) => customers.find(c => c.id === id)?.name || id.slice(0, 8);

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <p>Create and manage customer orders</p>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3>All Orders ({orders.length})</h3>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create Order'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 16, background: '#0f172a', borderRadius: 8 }}>
            <div className="form-group">
              <label>Customer</label>
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                <option value="">Select customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
            </div>
            <h4 style={{ margin: '12px 0 8px', fontSize: 14, color: '#94a3b8' }}>Order Items</h4>
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
                  <label>Weight (kg)</label>
                  <input type="number" min={0} step={0.1} value={item.weight} onChange={e => updateItem(idx, 'weight', +e.target.value)} required />
                </div>
                {items.length > 1 && (
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(idx)} style={{ marginBottom: 2 }}>X</button>
                )}
              </div>
            ))}
            <div className="btn-group" style={{ marginTop: 8 }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={addItem}>+ Add Item</button>
              <button type="submit" className="btn btn-success">Create Order</button>
            </div>
          </form>
        )}

        {orders.length === 0 ? (
          <div className="empty-state">No orders yet. Create one to get started.</div>
        ) : (
          <div className="grid">
            {orders.map(o => (
              <div key={o.id} className="card" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ fontSize: 13 }}>Order #{o.id.slice(0, 8)}</strong>
                  <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                </div>
                <div className="stats">
                  <span>Customer: {customerName(o.customerId)}</span>
                </div>
                <div className="stats" style={{ marginBottom: 8 }}>
                  <span>Total: ${o.totalPrice.toFixed(2)}</span>
                  <span>Weight: {o.totalWeight} kg</span>
                  <span>Items: {o.items.length}</span>
                </div>
                {o.items.map((item, i) => (
                  <div key={i} className="item-row">
                    <span>{item.productName} x{item.quantity}</span>
                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="btn-group" style={{ marginTop: 10 }}>
                  {o.status === 'Created' && (
                    <>
                      <button className="btn btn-primary btn-sm" onClick={() => handleAction(o.id, 'confirm')}>Confirm</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleAction(o.id, 'cancel')}>Cancel</button>
                    </>
                  )}
                  {o.status === 'Confirmed' && (
                    <button className="btn btn-warning btn-sm" onClick={() => handleAction(o.id, 'process')}>Process</button>
                  )}
                  {o.status === 'Processing' && (
                    <button className="btn btn-success btn-sm" onClick={() => handleAction(o.id, 'markReady')}>Ready for Delivery</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
