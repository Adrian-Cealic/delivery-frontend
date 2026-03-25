import { useState } from 'react';
import { protectedOrderService } from '../services/protectedOrderService';
import type { Order } from '../types';

export default function ProtectedOrdersPage() {
  const [role, setRole] = useState<string>('Admin');
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadOrders = async () => {
    setError('');
    setAccessDenied(false);
    setLoaded(false);
    try {
      const result = await protectedOrderService.getAll(role);
      setOrders(result);
      setLoaded(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Request failed';
      if (msg.includes('denied') || msg.includes('required') || msg.includes('Authentication')) {
        setAccessDenied(true);
      }
      setError(msg);
      setOrders([]);
    }
  };

  const roleColor = (r: string) => {
    switch (r) {
      case 'Admin': return 'badge-delivered';
      case 'Courier': return 'badge-confirmed';
      default: return 'badge-failed';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Protected Orders (Lab 5)</h1>
        <p>Proxy pattern: access control via X-User-Role header. Admin can read/write, Courier can read, None is blocked.</p>
      </div>

      {error && (
        <div className={accessDenied ? 'error-msg' : 'error-msg'} style={accessDenied ? {
          background: '#7f1d1d',
          border: '1px solid #dc2626',
          fontSize: 14,
          padding: 16,
        } : {}}>
          {accessDenied && <strong style={{ display: 'block', marginBottom: 4 }}>Access Denied (403)</strong>}
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3>Access Control</h3>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>User Role (sent via X-User-Role header)</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="Admin">Admin (full access)</option>
              <option value="Courier">Courier (read only)</option>
              <option value="None">None (no access)</option>
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={loadOrders}
            style={{ marginTop: 16 }}
          >
            Fetch Orders
          </button>
        </div>
        <div style={{ marginTop: 12 }}>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>Current role: </span>
          <span className={`badge ${roleColor(role)}`}>{role}</span>
        </div>
      </div>

      {loaded && !accessDenied && (
        <div className="card">
          <div className="card-header">
            <h3>Orders ({orders.length})</h3>
            <span className={`badge ${roleColor(role)}`}>Accessed as {role}</span>
          </div>
          {orders.length === 0 ? (
            <div className="empty-state">No orders found.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{o.id.slice(0, 8)}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{o.customerId.slice(0, 8)}</td>
                    <td><span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
                    <td>{o.priority}</td>
                    <td>${o.totalPrice.toFixed(2)}</td>
                    <td>{o.items.length}</td>
                    <td style={{ fontSize: 12 }}>{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {accessDenied && (
        <div className="card" style={{ borderColor: '#dc2626' }}>
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
            <h3 style={{ marginBottom: 8, color: '#f87171' }}>Access Denied</h3>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>
              The Protection Proxy blocked this request.
              {role === 'None' && ' Users with no role cannot access any data.'}
              {role === 'Courier' && ' Couriers have read-only access — write operations are blocked.'}
            </p>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>
              Try switching to <strong>Admin</strong> or <strong>Courier</strong> role above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
