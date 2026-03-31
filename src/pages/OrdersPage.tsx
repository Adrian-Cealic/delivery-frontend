import { useState, useEffect, type FormEvent } from 'react';
import { orderService } from '../services/orderService';
import { customerService } from '../services/customerService';
import PatternBanner from '../components/PatternBanner';
import StatusStepper from '../components/StatusStepper';
import StatChip from '../components/StatChip';
import type { Order, Customer, OrderItem } from '../types';

const ORDER_STEPS = ['Created', 'Confirmed', 'Processing', 'ReadyForDelivery', 'Delivered'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [deliveryNotes, setDeliveryNotes] = useState('');
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
      await orderService.create({
        customerId,
        items,
        priority,
        deliveryNotes: deliveryNotes || undefined,
      });
      setShowForm(false);
      setItems([{ productName: '', quantity: 1, unitPrice: 0, weight: 0 }]);
      setPriority('Normal');
      setDeliveryNotes('');
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

  const handleClone = async (id: string) => {
    try {
      await orderService.clone(id);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to clone order');
    }
  };

  const customerName = (id: string) => customers.find(c => c.id === id)?.name || id.slice(0, 8);

  const active = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <p>Create and manage customer orders through their lifecycle</p>
      </div>

      <PatternBanner
        patterns={[
          { name: 'Prototype', type: 'creational' },
          { name: 'Builder', type: 'creational' },
        ]}
        description="Duplicate uses the Prototype pattern — Order.Clone() creates a deep copy without coupling to the class. Builder pattern available via /api/orders/builder endpoint."
      />

      <div className="stat-chips">
        <StatChip label="Total" value={orders.length} color="accent" />
        <StatChip label="Active" value={active} color="warning" />
        <StatChip label="Delivered" value={delivered} color="success" />
        <StatChip label="Cancelled" value={orders.filter(o => o.status === 'Cancelled').length} color="danger" />
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3>All Orders</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create Order'}
          </button>
        </div>

        {showForm && (
          <div className="form-panel">
            <h4>New Order</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Customer</label>
                  <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                    <option value="">Select customer...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="Economy">Economy</option>
                    <option value="Normal">Normal</option>
                    <option value="Express">Express</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Delivery Notes (optional)</label>
                <input value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Leave at door, call before delivery..." />
              </div>
              <div className="items-section">
                <div className="items-section-label">Order Items</div>
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
                  <button type="submit" className="btn btn-success btn-sm">Create Order</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            No orders yet. Create one to get started.
          </div>
        ) : (
          <div className="grid">
            {orders.map(o => {
              const isCancelled = o.status === 'Cancelled';
              return (
                <div key={o.id} className="card" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>
                        Order <code>#{o.id.slice(0, 8)}</code>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{customerName(o.customerId)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <span className={`badge badge-${o.priority.toLowerCase()}`}>{o.priority}</span>
                      <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                    </div>
                  </div>

                  {!isCancelled && (
                    <StatusStepper steps={ORDER_STEPS} current={o.status} />
                  )}

                  <div className="divider" />

                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    <span>${o.totalPrice.toFixed(2)}</span>
                    <span>{o.totalWeight} kg</span>
                    <span>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</span>
                  </div>

                  {o.deliveryNotes && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, fontStyle: 'italic', borderLeft: '2px solid var(--border)', paddingLeft: 8 }}>
                      {o.deliveryNotes}
                    </div>
                  )}

                  {o.items.map((item, i) => (
                    <div key={i} className="item-row">
                      <span><strong>{item.productName}</strong> ×{item.quantity}</span>
                      <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="btn-group" style={{ marginTop: 10 }}>
                    <button className="btn btn-ghost btn-xs" onClick={() => handleClone(o.id)} title="Prototype.Clone()">Duplicate</button>
                    {o.status === 'Created' && (
                      <>
                        <button className="btn btn-success btn-xs" onClick={() => handleAction(o.id, 'confirm')}>Confirm</button>
                        <button className="btn btn-danger btn-xs" onClick={() => handleAction(o.id, 'cancel')}>Cancel</button>
                      </>
                    )}
                    {o.status === 'Confirmed' && (
                      <button className="btn btn-warning btn-xs" onClick={() => handleAction(o.id, 'process')}>Process</button>
                    )}
                    {o.status === 'Processing' && (
                      <button className="btn btn-success btn-xs" onClick={() => handleAction(o.id, 'markReady')}>Ready for Delivery</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
