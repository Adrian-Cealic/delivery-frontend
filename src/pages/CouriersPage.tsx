import { useState, useEffect, type FormEvent } from 'react';
import { courierService } from '../services/courierService';
import PatternBanner from '../components/PatternBanner';
import StatChip from '../components/StatChip';
import type { Courier } from '../types';

const VEHICLE_ICON: Record<string, string> = {
  Bicycle: '🚴',
  Car: '🚗',
  Drone: '🚁',
};

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

  const available = couriers.filter(c => c.isAvailable).length;

  return (
    <div>
      <div className="page-header">
        <h1>Couriers</h1>
        <p>Manage bike, car, and drone couriers</p>
      </div>

      <PatternBanner
        patterns={[{ name: 'Factory Method', type: 'creational' }]}
        description="CourierFactoryProvider.GetFactory(VehicleType) returns the correct factory. Each subtype (BikeCourier, CarCourier, DroneCourier) has its own creation logic, max weight, and speed calculation."
      />

      <div className="stat-chips">
        <StatChip label="Total" value={couriers.length} color="accent" />
        <StatChip label="Available" value={available} color="success" />
        <StatChip label="Busy" value={couriers.length - available} color="warning" />
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3>All Couriers</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Courier'}
          </button>
        </div>

        {showForm && (
          <div className="form-panel">
            <h4>New Courier — Factory will instantiate the correct subtype</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Courier Type</label>
                <select value={courierType} onChange={e => setCourierType(e.target.value as 'Bicycle' | 'Car' | 'Drone')}>
                  <option value="Bicycle">🚴 Bike Courier — max 5 kg, 3 min/km</option>
                  <option value="Car">🚗 Car Courier — variable capacity</option>
                  <option value="Drone">🚁 Drone Courier — max 2 kg, limited range</option>
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
              <button type="submit" className="btn btn-success btn-sm">Create Courier</button>
            </form>
          </div>
        )}

        {couriers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚴</div>
            No couriers yet. Add one to get started.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Max Weight</th>
                  <th>Status</th>
                  <th>Details</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {couriers.map(c => (
                  <tr key={c.id}>
                    <td>
                      <span className={`badge badge-${c.vehicleType.toLowerCase()}`}>
                        {VEHICLE_ICON[c.vehicleType]} {c.vehicleType}
                      </span>
                    </td>
                    <td><strong>{c.name}</strong></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.phone}</td>
                    <td>{c.maxWeight} kg</td>
                    <td>
                      <span className={`badge ${c.isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
                        {c.isAvailable ? 'Available' : 'Busy'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      {c.licensePlate && <span>Plate: <code>{c.licensePlate}</code></span>}
                      {c.maxFlightRangeKm && <span>Range: {c.maxFlightRangeKm} km</span>}
                      {!c.licensePlate && !c.maxFlightRangeKm && '—'}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-xs" onClick={() => handleDelete(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
