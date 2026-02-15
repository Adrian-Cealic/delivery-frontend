import { useState, useEffect, type FormEvent } from 'react';
import { courierService } from '../services/courierService';
import type { Courier } from '../types';

export default function CouriersPage() {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [error, setError] = useState('');
  const [courierType, setCourierType] = useState<'Bicycle' | 'Car' | 'Drone'>('Bicycle');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [maxFlightRange, setMaxFlightRange] = useState('');

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
      await courierService.create({
        vehicleType: courierType,
        name,
        phone,
        licensePlate: courierType === 'Car' ? licensePlate : undefined,
        maxFlightRangeKm: courierType === 'Drone' ? parseFloat(maxFlightRange) : undefined,
      });
      setName(''); setPhone(''); setLicensePlate(''); setMaxFlightRange('');
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
        <p>Manage bike, car, and drone couriers</p>
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
              <select value={courierType} onChange={e => setCourierType(e.target.value as 'Bicycle' | 'Car' | 'Drone')}>
                <option value="Bicycle">Bike Courier</option>
                <option value="Car">Car Courier</option>
                <option value="Drone">Drone Courier</option>
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
            {courierType === 'Car' && (
              <div className="form-group">
                <label>License Plate</label>
                <input value={licensePlate} onChange={e => setLicensePlate(e.target.value)} required />
              </div>
            )}
            {courierType === 'Drone' && (
              <div className="form-group">
                <label>Max Flight Range (km)</label>
                <input type="number" step="0.1" min="0.1" value={maxFlightRange}
                  onChange={e => setMaxFlightRange(e.target.value)} required />
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
                <th>Details</th>
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
                  <td>
                    {c.licensePlate && `Plate: ${c.licensePlate}`}
                    {c.maxFlightRangeKm && `Range: ${c.maxFlightRangeKm} km`}
                    {!c.licensePlate && !c.maxFlightRangeKm && '—'}
                  </td>
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
