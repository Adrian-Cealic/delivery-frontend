interface StatChipProps {
  label: string;
  value: string | number;
  color?: 'default' | 'success' | 'warning' | 'danger' | 'accent';
}

const CHIP_COLORS = {
  default: { bg: '#1e293b', text: '#94a3b8', val: '#f1f5f9' },
  success: { bg: '#052e16', text: '#4ade80', val: '#86efac' },
  warning: { bg: '#422006', text: '#fbbf24', val: '#fde68a' },
  danger:  { bg: '#450a0a', text: '#f87171', val: '#fca5a5' },
  accent:  { bg: '#1e3a5f', text: '#60a5fa', val: '#93c5fd' },
};

export default function StatChip({ label, value, color = 'default' }: StatChipProps) {
  const c = CHIP_COLORS[color];
  return (
    <div className="stat-chip" style={{ background: c.bg }}>
      <span className="stat-chip-value" style={{ color: c.val }}>{value}</span>
      <span className="stat-chip-label" style={{ color: c.text }}>{label}</span>
    </div>
  );
}
