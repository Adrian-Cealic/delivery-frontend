import { useState, useEffect, type FormEvent } from 'react';
import { deliveryService } from '../services/deliveryService';
import { orderService } from '../services/orderService';
import { courierService } from '../services/courierService';
import PatternBanner from '../components/PatternBanner';
import StatusStepper from '../components/StatusStepper';
import StatChip from '../components/StatChip';
import type { Delivery, Order, Courier } from '../types';

const DELIVERY_STEPS = ['Pending', 'Assigned', 'PickedUp', 'InTransit', 'Delivered'];

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

  const courierName = (id: string) => couriers.find(c => c.id === id)?.name ?? id.slice(0, 8);
  const inTransit = deliveries.filter(d => ['Assigned', 'PickedUp', 'InTransit'].includes(d.status)).length;

  return (
    <div>
      <div className="page-header">
        <h1>Deliveries</h1>
        <p>Assign couriers and track delivery progress</p>
      </div>

      <PatternBanner
        patterns={[
          { name: 'Flyweight', type: 'creational' },
          { name: 'Decorator', type: 'behavioral' },
        ]}
        description="DeliveryZoneFactory (Flyweight) reuses zone instances with the same properties. Notification chain (Decorator) wraps ConsoleNotification → LoggingDecorator → SmsDecorator on each status change."
      />

      <div className="stat-chips">
        <StatChip label="Total" value={deliveries.length} color="accent" />
        <StatChip label="In Transit" value={inTransit} color="warning" />
        <StatChip label="Delivered" value={deliveries.filter(d => d.status === 'Delivered').length} color="success" />
        <StatChip label="Failed" value={deliveries.filter(d => d.status === 'Failed').length} color="danger" />
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3>All Deliveries</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Assign Delivery'}
          </button>
        </div>

        {showForm && (
          <div className="form-panel">
            <h4>Assign Courier to Order</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Order (Ready for Delivery)</label>
                <select value={orderId} onChange={e => setOrderId(e.target.value)} required>
                  <option value="">Select order...</option>
                  {readyOrders.map(o => (
                    <option key={o.id} value={o.id}>
                      Order #{o.id.slice(0, 8)} — ${o.totalPrice.toFixed(2)} — {o.totalWeight} kg
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
                        {c.name} ({c.vehicleType}) — max {c.maxWeight} kg
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Distance (km)</label>
                  <input type="number" min={0.1} step={0.1} value={distanceKm} onChange={e => setDistanceKm(+e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="btn btn-success btn-sm">Assign Delivery</button>
            </form>
          </div>
        )}

        {deliveries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🗺️</div>
            No deliveries yet. Assign a courier to a ready order.
          </div>
        ) : (
          <div className="grid">
            {deliveries.map(d => {
              const isFailed = d.status === 'Failed';
              return (
                <div key={d.id} className="card" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>
                        Delivery <code>#{d.id.slice(0, 8)}</code>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{courierName(d.courierId)}</div>
                    </div>
                    <span className={`badge badge-${d.status.toLowerCase()}`}>{d.status}</span>
                  </div>

                  <StatusStepper steps={DELIVERY_STEPS} current={d.status} failed={isFailed} />

                  <div className="divider" />

                  <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    <span>Order: <code>#{d.orderId.slice(0, 8)}</code></span>
                    <span>{d.distanceKm} km</span>
                    {d.estimatedDeliveryTime && <span>ETA: {d.estimatedDeliveryTime}</span>}
                  </div>

                  <div className="btn-group">
                    {d.status === 'Assigned' && (
                      <button className="btn btn-primary btn-xs" onClick={() => handleAction(d.id, 'markPickedUp')}>Picked Up</button>
                    )}
                    {d.status === 'PickedUp' && (
                      <button className="btn btn-warning btn-xs" onClick={() => handleAction(d.id, 'markInTransit')}>In Transit</button>
                    )}
                    {d.status === 'InTransit' && (
                      <button className="btn btn-success btn-xs" onClick={() => handleAction(d.id, 'markDelivered')}>Delivered</button>
                    )}
                    {!['Delivered', 'Failed'].includes(d.status) && (
                      <button className="btn btn-danger btn-xs" onClick={() => handleAction(d.id, 'markFailed')}>Mark Failed</button>
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
