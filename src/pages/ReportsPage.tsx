import { useState } from 'react';
import { reportService } from '../services/reportService';
import PatternBanner from '../components/PatternBanner';
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
        <h1>Reports</h1>
        <p>Lab 5 — Bridge pattern: same report data, different renderers</p>
      </div>

      <PatternBanner
        patterns={[{ name: 'Bridge', type: 'behavioral' }]}
        description="The report abstraction (OrderSummaryReport, DeliveryStatusReport) is decoupled from the renderer implementation (ConsoleReportRenderer, JsonReportRenderer). Switch renderer at runtime without changing the report logic — the abstraction holds a reference to an IReportRenderer."
      />

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3>Renderer (Bridge Implementation)</h3>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>
              Select IReportRenderer implementation
            </div>
            <div className="renderer-toggle">
              <button
                className={`renderer-toggle-btn${format === 'console' ? ' active' : ''}`}
                onClick={() => setFormat('console')}
              >
                ConsoleReportRenderer
              </button>
              <button
                className={`renderer-toggle-btn${format === 'json' ? ' active' : ''}`}
                onClick={() => setFormat('json')}
              >
                JsonReportRenderer
              </button>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={loadReports} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Reports'}
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Order Summary</h3>
            {orderReport && (
              <span className={`badge ${isJson ? 'badge-confirmed' : 'badge-processing'}`}>
                {orderReport.format}
              </span>
            )}
          </div>
          {orderReport ? (
            <pre className="report-output" style={{ color: isJson ? '#60a5fa' : '#94a3b8' }}>
              {renderContent(orderReport.content)}
            </pre>
          ) : (
            <div className="empty-state">Click "Generate Reports" to view data</div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Delivery Status</h3>
            {deliveryReport && (
              <span className={`badge ${isJson ? 'badge-confirmed' : 'badge-processing'}`}>
                {deliveryReport.format}
              </span>
            )}
          </div>
          {deliveryReport ? (
            <pre className="report-output" style={{ color: isJson ? '#60a5fa' : '#94a3b8' }}>
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
