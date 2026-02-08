import { useState, useEffect, type FormEvent } from 'react';
import { deliveryService } from '../services/deliveryService';
import { orderService } from '../services/orderService';
import { courierService } from '../services/courierService';
import type { Delivery, Order, Courier } from '../types';

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [courierId, setCourierId] = useState('');
  const [distanceKm, setDistanceKm] = useState(5);

  const load = async () => {
    try {
      const [d, o, c] = await Promise.all([
        deliveryService.getAll(),
        orderService.getAll(),
        courierService.getAll(),
      ]);
      setDeliveries(d);
      setOrders(o);
      setCouriers(c);
      setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    }
  };

  useEffect(() => { load(); }, []);

  const readyOrders = orders.filter(o => o.status === 'ReadyForDelivery');
  const availableCouriers = couriers.filter(c => c.isAvailable);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await deliveryService.assign({ orderId, courierId, distanceKm });
      setShowForm(false);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to assign delivery');
    }
  };

  const handleAction = async (id: string, action: 'markPickedUp' | 'markInTransit' | 'markDelivered' | 'markFailed') => {
    try {
      await deliveryService[action](id);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Action failed');
    }
  };

  const courierName = (id: string) => couriers.find(c => c.id === id)?.name || id.slice(0, 8);

  return (
    <div>
      <div className="page-header">
        <h1>Deliveries</h1>
        <p>Assign couriers to orders and track delivery progress</p>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3>All Deliveries ({deliveries.length})</h3>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Assign Delivery'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 16, background: '#0f172a', borderRadius: 8 }}>
            <div className="form-group">
              <label>Order (Ready for Delivery)</label>
              <select value={orderId} onChange={e => setOrderId(e.target.value)} required>
                <option value="">Select order...</option>
                {readyOrders.map(o => (
                  <option key={o.id} value={o.id}>
                    Order #{o.id.slice(0, 8)} — ${o.totalPrice.toFixed(2)} — {o.totalWeight}kg
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Courier (Available)</label>
                <select value={courierId} onChange={e => setCourierId(e.target.value)} required>
                  <option value="">Select courier...</option>
                  {availableCouriers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.vehicleType}) — max {c.maxWeight}kg
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Distance (km)</label>
                <input type="number" min={0.1} step={0.1} value={distanceKm} onChange={e => setDistanceKm(+e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn btn-success">Assign Delivery</button>
          </form>
        )}

        {deliveries.length === 0 ? (
          <div className="empty-state">No deliveries yet. Assign a courier to an order to get started.</div>
        ) : (
          <div className="grid">
            {deliveries.map(d => (
              <div key={d.id} className="card" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ fontSize: 13 }}>Delivery #{d.id.slice(0, 8)}</strong>
                  <span className={`badge badge-${d.status.toLowerCase()}`}>{d.status}</span>
                </div>
                <div className="stats">
                  <span>Courier: {courierName(d.courierId)}</span>
                </div>
                <div className="stats">
                  <span>Order: #{d.orderId.slice(0, 8)}</span>
                  <span>Distance: {d.distanceKm} km</span>
                </div>
                {d.estimatedDeliveryTime && (
                  <div className="stats">
                    <span>ETA: {d.estimatedDeliveryTime}</span>
                  </div>
                )}
                <div className="btn-group" style={{ marginTop: 10 }}>
                  {d.status === 'Assigned' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleAction(d.id, 'markPickedUp')}>Picked Up</button>
                  )}
                  {d.status === 'PickedUp' && (
                    <button className="btn btn-warning btn-sm" onClick={() => handleAction(d.id, 'markInTransit')}>In Transit</button>
                  )}
                  {d.status === 'InTransit' && (
                    <button className="btn btn-success btn-sm" onClick={() => handleAction(d.id, 'markDelivered')}>Delivered</button>
                  )}
                  {d.status !== 'Delivered' && d.status !== 'Failed' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleAction(d.id, 'markFailed')}>Mark Failed</button>
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
