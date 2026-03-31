import { useState } from 'react';
import { protectedOrderService } from '../services/protectedOrderService';
import PatternBanner from '../components/PatternBanner';
import type { Order } from '../types';

export default function ProtectedOrdersPage() {
  const [role, setRole] = useState<string>('Admin');
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadOrders = async () => {
    setError('');
    setActionError('');
    setAccessDenied(false);
    setLoaded(false);
    try {
      const result = await protectedOrderService.getAll(role);
      setOrders(result);
      setLoaded(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Request failed';
      if (msg.toLowerCase().includes('denied') || msg.toLowerCase().includes('required') || msg.toLowerCase().includes('authentication')) {
        setAccessDenied(true);
      }
      setError(msg);
      setOrders([]);
    }
  };

  const handleAction = async (
    id: string,
    action: 'confirm' | 'cancel' | 'delete'
  ) => {
    setActionError('');
    try {
      if (action === 'delete') {
        await protectedOrderService.delete(id, role);
      } else if (action === 'confirm') {
        await protectedOrderService.confirm(id, role);
      } else {
        await protectedOrderService.cancel(id, role);
      }
      await loadOrders();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Action failed';
      setActionError(msg);
    }
  };

  const isAdmin = role === 'Admin';
  const isCourier = role === 'Courier';

  const ROLE_BADGE: Record<string, string> = {
    Admin: 'badge-delivered',
    Courier: 'badge-confirmed',
    None: 'badge-failed',
  };

  const PERM_ROWS: [string, boolean, boolean, boolean][] = [
    ['Read Orders', true, true, false],
    ['Confirm Order', true, false, false],
    ['Cancel Order', true, false, false],
    ['Delete Order', true, false, false],
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Protected Orders</h1>
        <p>Lab 5 — Proxy pattern: access control via X-User-Role header</p>
      </div>

      <PatternBanner
        patterns={[{ name: 'Proxy (Protection)', type: 'behavioral' }]}
        description="ProtectionOrderRepositoryProxy wraps InMemoryOrderRepository. Every call passes through the proxy, which reads X-User-Role from IAccessContext. Admin: full CRUD. Courier: read-only. None: blocked entirely (403)."
      />

      {/* Role permission matrix */}
      <div className="card">
        <div className="card-header">
          <h3>Proxy Permission Matrix</h3>
        </div>
        <div className="role-matrix">
          <div className="role-matrix-cell role-matrix-header">Operation</div>
          <div className="role-matrix-cell role-matrix-header">Admin</div>
          <div className="role-matrix-cell role-matrix-header">Courier</div>
          <div className="role-matrix-cell role-matrix-header">None</div>
          {PERM_ROWS.map(([op, admin, courier, none]) => (
            <>
              <div key={String(op)} className="role-matrix-cell" style={{ textAlign: 'left', fontWeight: 500 }}>{op}</div>
              <div className="role-matrix-cell"><span className={admin ? 'role-allowed' : 'role-denied'}>{admin ? '✓' : '✕'}</span></div>
              <div className="role-matrix-cell"><span className={courier ? 'role-readonly' : 'role-denied'}>{courier ? '✓' : '✕'}</span></div>
              <div className="role-matrix-cell"><span className={none ? 'role-allowed' : 'role-denied'}>{none ? '✓' : '✕'}</span></div>
            </>
          ))}
        </div>
      </div>

      {/* Role selector */}
      <div className="card">
        <div className="card-header">
          <h3>Simulate Role</h3>
          <span className={`badge ${ROLE_BADGE[role] ?? 'badge-created'}`}>{role}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 260 }}>
            <label>X-User-Role header value</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="Admin">Admin — full access</option>
              <option value="Courier">Courier — read only</option>
              <option value="None">None — blocked by proxy</option>
            </select>
          </div>
          <button className="btn btn-primary btn-sm" onClick={loadOrders}>Fetch Orders</button>
        </div>
        {isAdmin && <p style={{ marginTop: 10, fontSize: 12, color: '#4ade80' }}>Proxy allows: read + confirm + cancel + delete</p>}
        {isCourier && <p style={{ marginTop: 10, fontSize: 12, color: '#60a5fa' }}>Proxy allows read-only — write operations will be blocked (403)</p>}
        {!isAdmin && !isCourier && <p style={{ marginTop: 10, fontSize: 12, color: '#f87171' }}>Proxy blocks all access — no role header present</p>}
      </div>

      {(error || actionError) && (
        <div className="error-msg" style={accessDenied ? { border: '1px solid #dc2626', background: '#7f1d1d' } : {}}>
          {accessDenied && <strong style={{ display: 'block', marginBottom: 4 }}>Proxy blocked request (403)</strong>}
          {error || actionError}
        </div>
      )}

      {accessDenied && (
        <div className="card" style={{ borderColor: '#7f1d1d' }}>
          <div className="access-denied-card">
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔒</div>
            <h3>Access Denied</h3>
            <p style={{ marginTop: 6 }}>
              {role === 'None' ? 'No role header — proxy rejects the request.' : 'Proxy blocked this write operation for role: ' + role}
            </p>
            <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>Switch to <strong>Admin</strong> for full access.</p>
          </div>
        </div>
      )}

      {loaded && !accessDenied && (
        <div className="card">
          <div className="card-header">
            <h3>Orders ({orders.length})</h3>
            <span className={`badge ${ROLE_BADGE[role] ?? 'badge-created'}`}>via {role}</span>
          </div>
          {orders.length === 0 ? (
            <div className="empty-state">No orders found.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Total</th>
                    <th>Items</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td><code style={{ fontSize: 11 }}>#{o.id.slice(0, 8)}</code></td>
                      <td><span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
                      <td>{o.priority}</td>
                      <td>${o.totalPrice.toFixed(2)}</td>
                      <td>{o.items.length}</td>
                      <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleString()}</td>
                      <td>
                        <div className="btn-group">
                          {isAdmin && o.status === 'Created' && (
                            <button className="btn btn-success btn-xs" onClick={() => handleAction(o.id, 'confirm')}>Confirm</button>
                          )}
                          {isAdmin && ['Created', 'Confirmed'].includes(o.status) && (
                            <button className="btn btn-warning btn-xs" onClick={() => handleAction(o.id, 'cancel')}>Cancel</button>
                          )}
                          {isAdmin && (
                            <button className="btn btn-danger btn-xs" onClick={() => handleAction(o.id, 'delete')}>Delete</button>
                          )}
                          {!isAdmin && isCourier && (
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>read only</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
