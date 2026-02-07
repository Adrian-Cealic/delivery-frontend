import { useState, useEffect, type FormEvent } from 'react';
import { customerService } from '../services/customerService';
import type { Customer, CreateCustomerRequest } from '../types';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateCustomerRequest>({
    name: '', email: '', phone: '',
    address: { street: '', city: '', postalCode: '', country: '' },
  });

  const load = async () => {
    try {
      setCustomers(await customerService.getAll());
      setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load customers');
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await customerService.create(form);
      setForm({ name: '', email: '', phone: '', address: { street: '', city: '', postalCode: '', country: '' } });
      setShowForm(false);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create customer');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await customerService.delete(id);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete customer');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        <p>Manage customers in the delivery system</p>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3>All Customers ({customers.length})</h3>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Customer'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 16, background: '#0f172a', borderRadius: 8 }}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Street</label>
                <input value={form.address.street} onChange={e => setForm({ ...form, address: { ...form.address, street: e.target.value } })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input value={form.address.city} onChange={e => setForm({ ...form, address: { ...form.address, city: e.target.value } })} required />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input value={form.address.postalCode} onChange={e => setForm({ ...form, address: { ...form.address, postalCode: e.target.value } })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input value={form.address.country} onChange={e => setForm({ ...form, address: { ...form.address, country: e.target.value } })} required />
            </div>
            <button type="submit" className="btn btn-success">Create Customer</button>
          </form>
        )}

        {customers.length === 0 ? (
          <div className="empty-state">No customers yet. Add one to get started.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.address.street}, {c.address.city}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
