import { useState, useEffect, type FormEvent } from 'react';
import { courierService } from '../services/courierService';
import type { Courier } from '../types';

export default function CouriersPage() {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [error, setError] = useState('');
  const [courierType, setCourierType] = useState<'bike' | 'car'>('bike');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  const load = async () => {
    try {
      setCouriers(await courierService.getAll());
      setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load couriers');
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (courierType === 'bike') {
        await courierService.createBike({ name, phone });
      } else {
        await courierService.createCar({ name, phone, licensePlate });
      }
      setName(''); setPhone(''); setLicensePlate('');
      setShowForm(false);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create courier');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await courierService.delete(id);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete courier');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Couriers</h1>
        <p>Manage bike and car couriers</p>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3>All Couriers ({couriers.length})</h3>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Courier'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 16, background: '#0f172a', borderRadius: 8 }}>
            <div className="form-group">
              <label>Courier Type</label>
              <select value={courierType} onChange={e => setCourierType(e.target.value as 'bike' | 'car')}>
                <option value="bike">Bike Courier</option>
                <option value="car">Car Courier</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} required />
              </div>
            </div>
            {courierType === 'car' && (
              <div className="form-group">
                <label>License Plate</label>
                <input value={licensePlate} onChange={e => setLicensePlate(e.target.value)} required />
              </div>
            )}
            <button type="submit" className="btn btn-success">Create Courier</button>
          </form>
        )}

        {couriers.length === 0 ? (
          <div className="empty-state">No couriers yet. Add one to get started.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Max Weight</th>
                <th>Available</th>
                <th>License Plate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {couriers.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td><span className={`badge badge-${c.vehicleType.toLowerCase()}`}>{c.vehicleType}</span></td>
                  <td>{c.maxWeight} kg</td>
                  <td><span className={`badge ${c.isAvailable ? 'badge-delivered' : 'badge-cancelled'}`}>{c.isAvailable ? 'Yes' : 'No'}</span></td>
                  <td>{c.licensePlate || '—'}</td>
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
