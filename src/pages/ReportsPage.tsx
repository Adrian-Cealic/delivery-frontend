import { useState } from 'react';
import { reportService } from '../services/reportService';
import type { ReportResponse } from '../types';

export default function ReportsPage() {
  const [format, setFormat] = useState<'console' | 'json'>('console');
  const [orderReport, setOrderReport] = useState<ReportResponse | null>(null);
  const [deliveryReport, setDeliveryReport] = useState<ReportResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const [orders, deliveries] = await Promise.all([
        reportService.getOrderReport(format),
        reportService.getDeliveryReport(format),
      ]);
      setOrderReport(orders);
      setDeliveryReport(deliveries);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const isJson = format === 'json';

  const renderContent = (content: string) => {
    if (isJson) {
      try {
        const parsed = JSON.parse(content);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return content;
      }
    }
    return content;
  };

  return (
    <div>
      <div className="page-header">
        <h1>Reports (Lab 5)</h1>
        <p>Bridge pattern: same report data, different renderers (Console text vs JSON). Switch format and regenerate.</p>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3>Report Settings</h3>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Renderer Format (Bridge Implementation)</label>
            <select value={format} onChange={e => setFormat(e.target.value as 'console' | 'json')}>
              <option value="console">ConsoleReportRenderer (plain text)</option>
              <option value="json">JsonReportRenderer (structured JSON)</option>
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={loadReports}
            disabled={loading}
            style={{ marginTop: 16 }}
          >
            {loading ? 'Loading...' : 'Generate Reports'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3>Order Summary Report</h3>
            {orderReport && (
              <span className={`badge ${isJson ? 'badge-confirmed' : 'badge-processing'}`}>
                {orderReport.format}
              </span>
            )}
          </div>
          {orderReport ? (
            <pre style={{
              background: '#0f172a',
              padding: 16,
              borderRadius: 8,
              fontSize: 13,
              lineHeight: 1.6,
              overflow: 'auto',
              maxHeight: 400,
              color: isJson ? '#60a5fa' : '#94a3b8',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {renderContent(orderReport.content)}
            </pre>
          ) : (
            <div className="empty-state">Click "Generate Reports" to view data</div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Delivery Status Report</h3>
            {deliveryReport && (
              <span className={`badge ${isJson ? 'badge-confirmed' : 'badge-processing'}`}>
                {deliveryReport.format}
              </span>
            )}
          </div>
          {deliveryReport ? (
            <pre style={{
              background: '#0f172a',
              padding: 16,
              borderRadius: 8,
              fontSize: 13,
              lineHeight: 1.6,
              overflow: 'auto',
              maxHeight: 400,
              color: isJson ? '#60a5fa' : '#94a3b8',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {renderContent(deliveryReport.content)}
            </pre>
          ) : (
            <div className="empty-state">Click "Generate Reports" to view data</div>
          )}
        </div>
      </div>
    </div>
  );
}
