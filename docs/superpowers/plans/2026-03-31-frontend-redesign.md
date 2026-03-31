# Frontend Redesign — Delivery System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the `delivery-frontend` to make design patterns (Prototype, Factory, Façade, Adapter, Composite, Bridge, Proxy) clearly visible and understandable in the UI.

**Architecture:** Keep the existing React 19 + Vite + TypeScript stack with no new dependencies. Improve the CSS system significantly and add three focused shared components: `PatternBanner`, `StatusStepper`, and `StatChip`. Each page gets pattern annotations, improved layout, and visual workflow indicators.

**Tech Stack:** React 19, TypeScript, Vite, Custom CSS (CSS variables, dark theme)

---

## File Map

**New files:**
- `src/components/PatternBanner.tsx` — colored info strip per page, shows which pattern and a short description
- `src/components/StatusStepper.tsx` — horizontal step indicator for order and delivery state machines
- `src/components/StatChip.tsx` — small stat highlight (count, total, etc.) for page headers

**Modified files:**
- `src/index.css` — improved typography, form panels, hover effects, new utility classes
- `src/App.tsx` — sidebar with section groups and pattern labels
- `src/pages/CustomersPage.tsx` — StatChip row, improved form panel
- `src/pages/OrdersPage.tsx` — PatternBanner (Prototype/Builder), StatusStepper per order card
- `src/pages/CouriersPage.tsx` — PatternBanner (Factory), vehicle type indicators
- `src/pages/DeliveriesPage.tsx` — PatternBanner (State Machine), StatusStepper per delivery
- `src/pages/PlaceOrderPage.tsx` — PatternBanner (Façade + Adapter + Composite), improved layout
- `src/pages/ReportsPage.tsx` — PatternBanner (Bridge), improved renderer toggle
- `src/pages/ProtectedOrdersPage.tsx` — PatternBanner (Proxy), visual role permission matrix

**Pattern color coding:**
- Creational (Builder, Factory, Prototype, Singleton) → purple: `#7c3aed`
- Structural (Façade, Adapter, Composite) → cyan: `#0e7490`
- Behavioral (Bridge, Decorator, Proxy) → orange: `#c2410c`

---

## Task 1: Create PatternBanner component

**Files:**
- Create: `src/components/PatternBanner.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/PatternBanner.tsx
type PatternType = 'creational' | 'structural' | 'behavioral';

interface PatternBannerProps {
  patterns: { name: string; type: PatternType }[];
  description: string;
}

const TYPE_COLORS: Record<PatternType, { bg: string; border: string; text: string; label: string }> = {
  creational: { bg: '#1e1333', border: '#7c3aed', text: '#c4b5fd', label: 'Creational' },
  structural: { bg: '#0c1f26', border: '#0e7490', text: '#67e8f9', label: 'Structural' },
  behavioral: { bg: '#1c110a', border: '#c2410c', text: '#fdba74', label: 'Behavioral' },
};

export default function PatternBanner({ patterns, description }: PatternBannerProps) {
  return (
    <div className="pattern-banner">
      <div className="pattern-banner-tags">
        {patterns.map(p => {
          const c = TYPE_COLORS[p.type];
          return (
            <span
              key={p.name}
              className="pattern-tag"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
            >
              <span className="pattern-tag-label" style={{ color: c.border }}>{c.label}</span>
              {p.name}
            </span>
          );
        })}
      </div>
      <p className="pattern-banner-desc">{description}</p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd d:/utm/TMPP/delivery-frontend && git add src/components/PatternBanner.tsx && git commit -m "add pattern banner component for design pattern annotations"
```

---

## Task 2: Create StatusStepper component

**Files:**
- Create: `src/components/StatusStepper.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/StatusStepper.tsx
interface StatusStepperProps {
  steps: string[];
  current: string;
  failed?: boolean;
}

export default function StatusStepper({ steps, current, failed }: StatusStepperProps) {
  const currentIdx = steps.findIndex(
    s => s.toLowerCase() === current.toLowerCase()
  );

  return (
    <div className="status-stepper">
      {steps.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        const isFailed = failed && isActive;

        return (
          <div key={step} className="stepper-item">
            <div
              className={`stepper-dot ${isDone ? 'done' : ''} ${isActive ? (isFailed ? 'failed' : 'active') : ''}`}
            />
            {i < steps.length - 1 && (
              <div className={`stepper-line ${isDone ? 'done' : ''}`} />
            )}
            <span className={`stepper-label ${isActive ? (isFailed ? 'failed' : 'active') : ''} ${isDone ? 'done' : ''}`}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd d:/utm/TMPP/delivery-frontend && git add src/components/StatusStepper.tsx && git commit -m "add status stepper component for workflow visualization"
```

---

## Task 3: Create StatChip component

**Files:**
- Create: `src/components/StatChip.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/StatChip.tsx
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
```

- [ ] **Step 2: Commit**

```bash
cd d:/utm/TMPP/delivery-frontend && git add src/components/StatChip.tsx && git commit -m "add stat chip component for page header metrics"
```

---

## Task 4: Update index.css with improved styles

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace index.css entirely**

Replace the full contents of `src/index.css` with:

```css
:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #1e293b;
  --bg-input: #334155;
  --bg-panel: #0f172a;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  --border: #334155;
  --border-subtle: #1e293b;
  --radius: 8px;
  --radius-sm: 6px;
  --sidebar-width: 256px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  font-size: 14px;
}

/* ── App Layout ───────────────────────────────── */
.app { display: flex; min-height: 100vh; }

/* ── Sidebar ──────────────────────────────────── */
.sidebar {
  width: var(--sidebar-width);
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  padding: 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border);
}

.sidebar-logo-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: -0.3px;
}

.sidebar-logo-sub {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.sidebar-section {
  padding: 12px 0 4px;
}

.sidebar-section-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding: 0 16px 6px;
}

.sidebar-nav-btn {
  width: 100%;
  text-align: left;
  padding: 9px 16px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s, color 0.15s;
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.4;
}

.sidebar-nav-btn:hover {
  background: rgba(255,255,255,0.04);
  color: var(--text-primary);
}

.sidebar-nav-btn.active {
  background: rgba(59,130,246,0.15);
  color: #93c5fd;
  font-weight: 600;
  border-right: 2px solid var(--accent);
}

.sidebar-nav-btn .nav-icon {
  font-size: 15px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.sidebar-nav-btn .nav-pattern-tag {
  margin-left: auto;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.8;
}

.nav-pt-creational { background: #2e1065; color: #c4b5fd; }
.nav-pt-structural  { background: #0c1f26; color: #67e8f9; }
.nav-pt-behavioral  { background: #431407; color: #fdba74; }

/* ── Main Content ──────────────────────────────── */
.main-content {
  margin-left: var(--sidebar-width);
  flex: 1;
  padding: 32px 36px;
  max-width: calc(1280px + var(--sidebar-width));
  min-width: 0;
}

/* ── Page Header ───────────────────────────────── */
.page-header { margin-bottom: 20px; }

.page-header h1 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.4px;
  margin-bottom: 3px;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 13px;
}

/* ── Pattern Banner ────────────────────────────── */
.pattern-banner {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.pattern-banner-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.pattern-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.pattern-tag-label {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.8;
  margin-right: 2px;
}

.pattern-banner-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  padding-top: 2px;
}

/* ── Stat Chips ────────────────────────────────── */
.stat-chips {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 18px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  min-width: 80px;
}

.stat-chip-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-chip-label {
  font-size: 11px;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Status Stepper ────────────────────────────── */
.status-stepper {
  display: flex;
  align-items: flex-start;
  gap: 0;
  padding: 8px 0 4px;
  overflow-x: auto;
}

.stepper-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  min-width: 60px;
}

.stepper-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border);
  border: 2px solid var(--bg-secondary);
  z-index: 1;
  transition: background 0.2s;
}

.stepper-dot.done    { background: var(--success); }
.stepper-dot.active  { background: var(--accent); box-shadow: 0 0 0 3px rgba(59,130,246,0.25); }
.stepper-dot.failed  { background: var(--danger);  box-shadow: 0 0 0 3px rgba(239,68,68,0.25); }

.stepper-line {
  position: absolute;
  top: 4px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: var(--border);
  z-index: 0;
}

.stepper-line.done { background: var(--success); }

.stepper-label {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 6px;
  text-align: center;
  line-height: 1.3;
}

.stepper-label.active { color: var(--accent); font-weight: 600; }
.stepper-label.failed { color: var(--danger);  font-weight: 600; }
.stepper-label.done   { color: var(--success); }

/* ── Card ──────────────────────────────────────── */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}

.card-header h3 {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.2px;
}

/* ── Grid ──────────────────────────────────────── */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

@media (max-width: 900px) { .grid-2 { grid-template-columns: 1fr; } }

/* ── Form Panel ────────────────────────────────── */
.form-panel {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  margin-bottom: 16px;
}

.form-panel h4 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-subtle);
}

.form-group { margin-bottom: 12px; }

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-row-3 { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px; }
.form-row-4 { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 8px; }

.items-section { margin-top: 14px; }

.items-section-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-entry {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  margin-bottom: 8px;
  padding: 10px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
}

.item-entry .form-group { margin-bottom: 0; }

/* ── Buttons ───────────────────────────────────── */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  font-family: inherit;
}

.btn:active { transform: scale(0.97); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--accent-hover); }

.btn-success { background: var(--success); color: white; }
.btn-success:hover:not(:disabled) { opacity: 0.88; }

.btn-warning { background: var(--warning); color: #000; }
.btn-warning:hover:not(:disabled) { opacity: 0.88; }

.btn-danger { background: var(--danger); color: white; }
.btn-danger:hover:not(:disabled) { opacity: 0.88; }

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
}
.btn-ghost:hover:not(:disabled) { background: var(--bg-input); color: var(--text-primary); }

.btn-sm { padding: 4px 10px; font-size: 12px; }
.btn-xs { padding: 2px 8px; font-size: 11px; }
.btn-group { display: flex; gap: 6px; flex-wrap: wrap; }

/* ── Badges ────────────────────────────────────── */
.badge {
  display: inline-block;
  padding: 2px 9px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

/* Order Status */
.badge-created          { background: #1e293b; color: #94a3b8; }
.badge-confirmed        { background: #1e3a5f; color: #60a5fa; }
.badge-processing       { background: #422006; color: #fbbf24; }
.badge-readyfordelivery { background: #14532d; color: #4ade80; }
.badge-indelivery       { background: #312e81; color: #a78bfa; }
.badge-delivered        { background: #052e16; color: #22c55e; }
.badge-cancelled        { background: #450a0a; color: #f87171; }

/* Delivery Status */
.badge-pending  { background: #1e293b; color: #94a3b8; }
.badge-assigned { background: #1e3a5f; color: #60a5fa; }
.badge-pickedup { background: #422006; color: #fbbf24; }
.badge-intransit { background: #312e81; color: #a78bfa; }
.badge-failed   { background: #450a0a; color: #f87171; }

/* Vehicle */
.badge-bicycle { background: #064e3b; color: #34d399; }
.badge-car     { background: #1e3a5f; color: #60a5fa; }
.badge-drone   { background: #312e81; color: #a78bfa; }

/* Priority */
.badge-express  { background: #4c0519; color: #fda4af; }
.badge-normal   { background: #1e3a5f; color: #60a5fa; }
.badge-economy  { background: #1c1917; color: #78716c; }

/* Availability */
.badge-available   { background: #052e16; color: #22c55e; }
.badge-unavailable { background: #450a0a; color: #f87171; }

/* ── Table ─────────────────────────────────────── */
.table-wrap { overflow-x: auto; }

table { width: 100%; border-collapse: collapse; }

th, td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}

th {
  color: var(--text-muted);
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(255,255,255,0.02);
}

tbody tr:hover { background: rgba(255,255,255,0.025); }
tbody tr:last-child td { border-bottom: none; }

/* ── Misc ──────────────────────────────────────── */
.item-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 13px;
  color: var(--text-secondary);
}
.item-row:last-child { border-bottom: none; }
.item-row strong { color: var(--text-primary); }

.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: var(--text-muted);
  font-size: 13px;
}

.empty-state-icon { font-size: 32px; margin-bottom: 8px; }

.error-msg {
  background: #450a0a;
  color: #fca5a5;
  padding: 10px 14px;
  border-radius: var(--radius);
  font-size: 13px;
  margin-bottom: 12px;
  border: 1px solid #7f1d1d;
}

.success-msg {
  background: #052e16;
  color: #86efac;
  padding: 10px 14px;
  border-radius: var(--radius);
  font-size: 13px;
  margin-bottom: 12px;
  border: 1px solid #166534;
}

.access-denied-card {
  text-align: center;
  padding: 40px;
}

.access-denied-card h3 { font-size: 18px; color: #f87171; margin-bottom: 8px; }
.access-denied-card p { color: var(--text-secondary); font-size: 13px; }

.role-matrix {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 16px;
  font-size: 12px;
}

.role-matrix-cell {
  background: var(--bg-card);
  padding: 8px 10px;
  text-align: center;
}

.role-matrix-header {
  background: rgba(255,255,255,0.03);
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.role-allowed   { color: #4ade80; font-weight: 600; }
.role-denied    { color: #f87171; font-weight: 600; }
.role-readonly  { color: #60a5fa; font-weight: 600; }

pre.report-output {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  padding: 16px;
  border-radius: var(--radius);
  font-size: 12px;
  line-height: 1.7;
  overflow: auto;
  max-height: 420px;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Consolas', 'Monaco', monospace;
}

.renderer-toggle {
  display: flex;
  gap: 2px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 3px;
}

.renderer-toggle-btn {
  flex: 1;
  padding: 6px 14px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  background: transparent;
  color: var(--text-muted);
  font-family: inherit;
}

.renderer-toggle-btn.active {
  background: var(--accent);
  color: white;
}

.catalog-tree { font-size: 13px; }

.catalog-node {
  padding: 4px 0;
}

.catalog-node-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 6px;
  border-radius: 4px;
  transition: background 0.1s;
}

.catalog-node-row:hover { background: rgba(255,255,255,0.03); }

.catalog-node-name { color: var(--text-primary); }
.catalog-node-price { color: var(--text-muted); font-size: 12px; }
.catalog-node-weight { color: var(--text-muted); font-size: 11px; }

.divider {
  height: 1px;
  background: var(--border);
  margin: 16px 0;
}

code {
  background: var(--bg-input);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  font-family: 'Consolas', monospace;
  color: #93c5fd;
}
```

- [ ] **Step 2: Commit**

```bash
cd d:/utm/TMPP/delivery-frontend && git add src/index.css && git commit -m "update index.css with improved layout typography and utility classes"
```

---

## Task 5: Update App.tsx — improved sidebar

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace App.tsx**

```tsx
import { useState } from 'react';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import CouriersPage from './pages/CouriersPage';
import DeliveriesPage from './pages/DeliveriesPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import ReportsPage from './pages/ReportsPage';
import ProtectedOrdersPage from './pages/ProtectedOrdersPage';

type Page = 'customers' | 'orders' | 'couriers' | 'deliveries' | 'place' | 'reports' | 'protected';

interface NavItem {
  key: Page;
  label: string;
  icon: string;
  patternTag?: { label: string; cls: string };
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Data',
    items: [
      { key: 'customers', label: 'Customers', icon: '👤' },
      { key: 'orders', label: 'Orders', icon: '📦', patternTag: { label: 'Prototype', cls: 'nav-pt-creational' } },
      { key: 'couriers', label: 'Couriers', icon: '🚴', patternTag: { label: 'Factory', cls: 'nav-pt-creational' } },
      { key: 'deliveries', label: 'Deliveries', icon: '🗺️' },
    ],
  },
  {
    title: 'Lab 4 — Structural',
    items: [
      { key: 'place', label: 'Place Order', icon: '✨', patternTag: { label: 'Façade', cls: 'nav-pt-structural' } },
    ],
  },
  {
    title: 'Lab 5 — Behavioral',
    items: [
      { key: 'reports', label: 'Reports', icon: '📊', patternTag: { label: 'Bridge', cls: 'nav-pt-behavioral' } },
      { key: 'protected', label: 'Protected Orders', icon: '🔒', patternTag: { label: 'Proxy', cls: 'nav-pt-behavioral' } },
    ],
  },
];

export default function App() {
  const [activePage, setActivePage] = useState<Page>('customers');

  const renderPage = () => {
    switch (activePage) {
      case 'customers':  return <CustomersPage />;
      case 'orders':     return <OrdersPage />;
      case 'place':      return <PlaceOrderPage />;
      case 'couriers':   return <CouriersPage />;
      case 'deliveries': return <DeliveriesPage />;
      case 'reports':    return <ReportsPage />;
      case 'protected':  return <ProtectedOrdersPage />;
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-title">Delivery System</div>
          <div className="sidebar-logo-sub">Design Pattern Explorer</div>
        </div>
        {NAV_SECTIONS.map(section => (
          <div key={section.title} className="sidebar-section">
            <div className="sidebar-section-label">{section.title}</div>
            {section.items.map(item => (
              <button
                key={item.key}
                className={`sidebar-nav-btn${activePage === item.key ? ' active' : ''}`}
                onClick={() => setActivePage(item.key)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.patternTag && (
                  <span className={`nav-pattern-tag ${item.patternTag.cls}`}>
                    {item.patternTag.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </aside>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd d:/utm/TMPP/delivery-frontend && git add src/App.tsx && git commit -m "update sidebar with section groups and pattern labels"
```

---

## Task 6: Update CustomersPage

**Files:**
- Modify: `src/pages/CustomersPage.tsx`

- [ ] **Step 1: Replace CustomersPage.tsx**

```tsx
import { useState, useEffect, type FormEvent } from 'react';
import { customerService } from '../services/customerService';
import StatChip from '../components/StatChip';
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
        <p>Manage customers registered in the delivery system</p>
      </div>

      <div className="stat-chips">
        <StatChip label="Total" value={customers.length} color="accent" />
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3>All Customers</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Customer'}
          </button>
        </div>

        {showForm && (
          <div className="form-panel">
            <h4>New Customer</h4>
            <form onSubmit={handleSubmit}>
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
          </div>
        )}

        {customers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            No customers yet. Add one to get started.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Address</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.email}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.phone}</td>
                    <td>{c.address.city}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{c.address.street}, {c.address.postalCode}</td>
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
```

- [ ] **Step 2: Commit**

```bash
cd d:/utm/TMPP/delivery-frontend && git add src/pages/CustomersPage.tsx && git commit -m "update customers page with stat chip and improved table layout"
```

---

## Task 7: Update OrdersPage

**Files:**
- Modify: `src/pages/OrdersPage.tsx`

- [ ] **Step 1: Replace OrdersPage.tsx**

```tsx
import { useState, useEffect, type FormEvent } from 'react';
import { orderService } from '../services/orderService';
import { customerService } from '../services/customerService';
import PatternBanner from '../components/PatternBanner';
import StatusStepper from '../components/StatusStepper';
import StatChip from '../components/StatChip';
import type { Order, Customer, OrderItem } from '../types';

const ORDER_STEPS = ['Created', 'Confirmed', 'Processing', 'ReadyForDelivery', 'Delivered'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [items, setItems] = useState<OrderItem[]>([{ productName: '', quantity: 1, unitPrice: 0, weight: 0 }]);

  const load = async () => {
    try {
      const [o, c] = await Promise.all([orderService.getAll(), customerService.getAll()]);
      setOrders(o);
      setCustomers(c);
      setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    }
  };

  useEffect(() => { load(); }, []);

  const addItem = () => setItems([...items, { productName: '', quantity: 1, unitPrice: 0, weight: 0 }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof OrderItem, value: string | number) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await orderService.create({ customerId, items, priority, deliveryNotes: deliveryNotes || undefined });
      setShowForm(false);
      setItems([{ productName: '', quantity: 1, unitPrice: 0, weight: 0 }]);
      setPriority('Normal');
      setDeliveryNotes('');
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create order');
    }
  };

  const handleAction = async (id: string, action: 'confirm' | 'process' | 'markReady' | 'cancel') => {
    try { await orderService[action](id); load(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Action failed'); }
  };

  const handleClone = async (id: string) => {
    try { await orderService.clone(id); load(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed to clone order'); }
  };

  const customerName = (id: string) => customers.find(c => c.id === id)?.name ?? id.slice(0, 8);

  const active = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <p>Create and manage customer orders through their lifecycle</p>
      </div>

      <PatternBanner
        patterns={[
          { name: 'Prototype', type: 'creational' },
          { name: 'Builder', type: 'creational' },
        ]}
        description="Duplicate uses the Prototype pattern — Order.Clone() creates a deep copy without coupling to the class. Builder pattern available via /api/orders/builder endpoint."
      />

      <div className="stat-chips">
        <StatChip label="Total" value={orders.length} color="accent" />
        <StatChip label="Active" value={active} color="warning" />
        <StatChip label="Delivered" value={delivered} color="success" />
        <StatChip label="Cancelled" value={orders.filter(o => o.status === 'Cancelled').length} color="danger" />
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3>All Orders</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create Order'}
          </button>
        </div>

        {showForm && (
          <div className="form-panel">
            <h4>New Order</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group" style={{ gridColumn: 'span 1' }}>
                  <label>Customer</label>
                  <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                    <option value="">Select customer...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="Economy">Economy</option>
                    <option value="Normal">Normal</option>
                    <option value="Express">Express</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Delivery Notes (optional)</label>
                <input value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Leave at door, call before delivery..." />
              </div>
              <div className="items-section">
                <div className="items-section-label">Order Items</div>
                {items.map((item, idx) => (
                  <div key={idx} className="item-entry">
                    <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                      <label>Product</label>
                      <input value={item.productName} onChange={e => updateItem(idx, 'productName', e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                      <label>Qty</label>
                      <input type="number" min={1} value={item.quantity} onChange={e => updateItem(idx, 'quantity', +e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                      <label>Price $</label>
                      <input type="number" min={0} step={0.01} value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', +e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                      <label>Weight kg</label>
                      <input type="number" min={0} step={0.1} value={item.weight} onChange={e => updateItem(idx, 'weight', +e.target.value)} required />
                    </div>
                    {items.length > 1 && (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeItem(idx)} style={{ marginBottom: 0, alignSelf: 'flex-end' }}>✕</button>
                    )}
                  </div>
                ))}
                <div className="btn-group" style={{ marginTop: 8 }}>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={addItem}>+ Add Item</button>
                  <button type="submit" className="btn btn-success btn-sm">Create Order</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            No orders yet. Create one to get started.
          </div>
        ) : (
          <div className="grid">
            {orders.map(o => {
              const isCancelled = o.status === 'Cancelled';
              return (
                <div key={o.id} className="card" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>
                        Order <code>#{o.id.slice(0, 8)}</code>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{customerName(o.customerId)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <span className={`badge badge-${o.priority.toLowerCase()}`}>{o.priority}</span>
                      <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                    </div>
                  </div>

                  {!isCancelled && (
                    <StatusStepper steps={ORDER_STEPS} current={o.status} />
                  )}

                  <div className="divider" />

                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    <span>${o.totalPrice.toFixed(2)}</span>
                    <span>{o.totalWeight} kg</span>
                    <span>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</span>
                  </div>

                  {o.deliveryNotes && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, fontStyle: 'italic', borderLeft: '2px solid var(--border)', paddingLeft: 8 }}>
                      {o.deliveryNotes}
                    </div>
                  )}

                  {o.items.map((item, i) => (
                    <div key={i} className="item-row">
                      <span><strong>{item.productName}</strong> ×{item.quantity}</span>
                      <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="btn-group" style={{ marginTop: 10 }}>
                    <button className="btn btn-ghost btn-xs" onClick={() => handleClone(o.id)} title="Prototype.Clone()">Duplicate</button>
                    {o.status === 'Created' && (
                      <>
                        <button className="btn btn-success btn-xs" onClick={() => handleAction(o.id, 'confirm')}>Confirm</button>
                        <button className="btn btn-danger btn-xs" onClick={() => handleAction(o.id, 'cancel')}>Cancel</button>
                      </>
                    )}
                    {o.status === 'Confirmed' && (
                      <button className="btn btn-warning btn-xs" onClick={() => handleAction(o.id, 'process')}>Process</button>
                    )}
                    {o.status === 'Processing' && (
                      <button className="btn btn-success btn-xs" onClick={() => handleAction(o.id, 'markReady')}>Ready for Delivery</button>
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
```

- [ ] **Step 2: Commit**

```bash
cd d:/utm/TMPP/delivery-frontend && git add src/pages/OrdersPage.tsx && git commit -m "update orders page with prototype banner and status stepper"
```

---

## Task 8: Update CouriersPage

**Files:**
- Modify: `src/pages/CouriersPage.tsx`

- [ ] **Step 1: Replace CouriersPage.tsx**

```tsx
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
    try { await courierService.delete(id); load(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed to delete courier'); }
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
```

- [ ] **Step 2: Commit**

```bash
cd d:/utm/TMPP/delivery-frontend && git add src/pages/CouriersPage.tsx && git commit -m "update couriers page with factory pattern banner and vehicle icons"
```

---

## Task 9: Update DeliveriesPage

**Files:**
- Modify: `src/pages/DeliveriesPage.tsx`

- [ ] **Step 1: Replace DeliveriesPage.tsx**

```tsx
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
      const [d, o, c] = await Promise.all([deliveryService.getAll(), orderService.getAll(), courierService.getAll()]);
      setDeliveries(d); setOrders(o); setCouriers(c);
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
    try { await deliveryService[action](id); load(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Action failed'); }
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
```

- [ ] **Step 2: Commit**

```bash
cd d:/utm/TMPP/delivery-frontend && git add src/pages/DeliveriesPage.tsx && git commit -m "update deliveries page with status stepper and flyweight decorator banner"
```

---

## Task 10: Update PlaceOrderPage

**Files:**
- Modify: `src/pages/PlaceOrderPage.tsx`

- [ ] **Step 1: Replace PlaceOrderPage.tsx**

```tsx
import { useState, useEffect, type FormEvent } from 'react';
import { catalogService } from '../services/catalogService';
import { orderService } from '../services/orderService';
import { customerService } from '../services/customerService';
import PatternBanner from '../components/PatternBanner';
import type { CatalogNode, Customer, PlaceOrderItemDto } from '../types';

function CatalogTree({ node, depth = 0 }: { node: CatalogNode; depth?: number }) {
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div className="catalog-node" style={{ marginLeft: depth * 14 }}>
      <div className="catalog-node-row">
        <span style={{ fontSize: 13, color: hasChildren ? '#f59e0b' : '#64748b' }}>
          {hasChildren ? '▸' : '·'}
        </span>
        <span className="catalog-node-name">{node.name}</span>
        <span className="catalog-node-price">${node.totalPrice.toFixed(2)}</span>
        <span className="catalog-node-weight">{node.totalWeight.toFixed(2)} kg</span>
      </div>
      {hasChildren && node.children.map((child, i) => (
        <CatalogTree key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function PlaceOrderPage() {
  const [catalog, setCatalog] = useState<CatalogNode | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [paymentGateway, setPaymentGateway] = useState('PayPal');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [items, setItems] = useState<PlaceOrderItemDto[]>([
    { productName: '', quantity: 1, unitPrice: 0, weight: 0 },
  ]);

  const load = async () => {
    try {
      const [cat, cust] = await Promise.all([catalogService.getCatalog(), customerService.getAll()]);
      setCatalog(cat); setCustomers(cust); setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  };

  useEffect(() => { load(); }, []);

  const addItem = () => setItems([...items, { productName: '', quantity: 1, unitPrice: 0, weight: 0 }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof PlaceOrderItemDto, value: string | number) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const validItems = items.filter(i => i.productName.trim() && i.quantity > 0 && i.unitPrice >= 0);
    if (validItems.length === 0) { setError('Add at least one valid item'); return; }
    try {
      const result = await orderService.place({ customerId, items: validItems, paymentGateway, deliveryNotes: deliveryNotes || undefined });
      if (result.success) {
        setSuccess(`Order placed! ID: ${result.orderId}`);
        setItems([{ productName: '', quantity: 1, unitPrice: 0, weight: 0 }]);
        setDeliveryNotes('');
      } else {
        setError(result.message);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Place order failed');
    }
  };

  const GATEWAY_LABELS: Record<string, string> = {
    PayPal: '💳 PayPal',
    Stripe: '⚡ Stripe',
    GooglePay: '🔵 Google Pay',
  };

  return (
    <div>
      <div className="page-header">
        <h1>Place Order</h1>
        <p>Lab 4 — Structural patterns in action</p>
      </div>

      <PatternBanner
        patterns={[
          { name: 'Façade', type: 'structural' },
          { name: 'Adapter', type: 'structural' },
          { name: 'Composite', type: 'structural' },
        ]}
        description="Façade: OrderPlacementFacade hides order creation + payment + delivery in one call. Adapter: PayPal/Stripe/GooglePay each have different APIs, adapted to IPaymentGateway. Composite: catalog items form a tree — leaf nodes and groups share the same interface."
      />

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">✓ {success}</div>}

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Product Catalog</h3>
            <span className="badge" style={{ background: '#0c1f26', color: '#67e8f9', border: '1px solid #0e7490', fontSize: 10 }}>Composite</span>
          </div>
          {catalog ? (
            <div className="catalog-tree" style={{ maxHeight: 380, overflowY: 'auto' }}>
              <CatalogTree node={catalog} />
            </div>
          ) : (
            <div className="empty-state">Loading catalog...</div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Place Order via Façade</h3>
            <span className="badge" style={{ background: '#0c1f26', color: '#67e8f9', border: '1px solid #0e7490', fontSize: 10 }}>Façade</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Customer</label>
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                <option value="">Select customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Payment Gateway <span style={{ color: '#0e7490', fontSize: 10, fontWeight: 700 }}>ADAPTER</span></label>
              <select value={paymentGateway} onChange={e => setPaymentGateway(e.target.value)}>
                {Object.entries(GATEWAY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Delivery Notes</label>
              <input value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)} placeholder="Optional" />
            </div>
            <div className="items-section">
              <div className="items-section-label">Items</div>
              {items.map((item, idx) => (
                <div key={idx} className="item-entry">
                  <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                    <label>Product</label>
                    <input value={item.productName} onChange={e => updateItem(idx, 'productName', e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Qty</label>
                    <input type="number" min={1} value={item.quantity} onChange={e => updateItem(idx, 'quantity', +e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Price $</label>
                    <input type="number" min={0} step={0.01} value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', +e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Weight kg</label>
                    <input type="number" min={0} step={0.1} value={item.weight} onChange={e => updateItem(idx, 'weight', +e.target.value)} required />
                  </div>
                  {items.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeItem(idx)} style={{ alignSelf: 'flex-end' }}>✕</button>
                  )}
                </div>
              ))}
              <div className="btn-group" style={{ marginTop: 8 }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={addItem}>+ Add Item</button>
                <button type="submit" className="btn btn-success btn-sm">Place Order</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd d:/utm/TMPP/delivery-frontend && git add src/pages/PlaceOrderPage.tsx && git commit -m "update place order page with facade adapter composite pattern labels"
```

---

## Task 11: Update ReportsPage

**Files:**
- Modify: `src/pages/ReportsPage.tsx`

- [ ] **Step 1: Replace ReportsPage.tsx**

```tsx
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
    setLoading(true); setError('');
    try {
      const [orders, deliveries] = await Promise.all([
        reportService.getOrderReport(format),
        reportService.getDeliveryReport(format),
      ]);
      setOrderReport(orders); setDeliveryReport(deliveries);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content: string) => {
    if (format === 'json') {
      try { return JSON.stringify(JSON.parse(content), null, 2); }
      catch { return content; }
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
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
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
          <button className="btn btn-primary btn-sm" onClick={loadReports} disabled={loading} style={{ marginTop: 22 }}>
            {loading ? 'Generating...' : 'Generate Reports'}
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Order Summary</h3>
            {orderReport && (
              <span className={`badge ${format === 'json' ? 'badge-confirmed' : 'badge-processing'}`}>
                {orderReport.format}
              </span>
            )}
          </div>
          {orderReport ? (
            <pre className="report-output" style={{ color: format === 'json' ? '#60a5fa' : '#94a3b8' }}>
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
              <span className={`badge ${format === 'json' ? 'badge-confirmed' : 'badge-processing'}`}>
                {deliveryReport.format}
              </span>
            )}
          </div>
          {deliveryReport ? (
            <pre className="report-output" style={{ color: format === 'json' ? '#60a5fa' : '#94a3b8' }}>
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
```

- [ ] **Step 2: Commit**

```bash
cd d:/utm/TMPP/delivery-frontend && git add src/pages/ReportsPage.tsx && git commit -m "update reports page with bridge pattern toggle and renderer labels"
```

---

## Task 12: Update ProtectedOrdersPage

**Files:**
- Modify: `src/pages/ProtectedOrdersPage.tsx`

- [ ] **Step 1: Replace ProtectedOrdersPage.tsx**

```tsx
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
    setError(''); setActionError(''); setAccessDenied(false); setLoaded(false);
    try {
      setOrders(await protectedOrderService.getAll(role));
      setLoaded(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Request failed';
      if (msg.toLowerCase().includes('denied') || msg.toLowerCase().includes('required') || msg.toLowerCase().includes('authentication')) {
        setAccessDenied(true);
      }
      setError(msg); setOrders([]);
    }
  };

  const handleAction = async (id: string, action: 'confirm' | 'cancel' | 'delete') => {
    setActionError('');
    try {
      if (action === 'delete') await protectedOrderService.delete(id, role);
      else if (action === 'confirm') await protectedOrderService.confirm(id, role);
      else await protectedOrderService.cancel(id, role);
      await loadOrders();
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Action failed');
    }
  };

  const isAdmin = role === 'Admin';
  const isCourier = role === 'Courier';

  const ROLE_BADGE: Record<string, string> = {
    Admin: 'badge-delivered',
    Courier: 'badge-confirmed',
    None: 'badge-failed',
  };

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
          {[
            ['Read Orders', true, true, false],
            ['Confirm Order', true, false, false],
            ['Cancel Order', true, false, false],
            ['Delete Order', true, false, false],
          ].map(([op, admin, courier, none]) => (
            <>
              <div key={String(op)} className="role-matrix-cell" style={{ textAlign: 'left', fontWeight: 500 }}>{op}</div>
              <div className="role-matrix-cell"><span className={admin ? 'role-allowed' : 'role-denied'}>{admin ? '✓' : '✕'}</span></div>
              <div className="role-matrix-cell"><span className={courier ? 'role-readonly' : 'role-denied'}>{courier ? '✓' : '✕'}</span></div>
              <div className="role-matrix-cell"><span className={none ? 'role-allowed' : 'role-denied'}>{none ? '✓' : '✕'}</span></div>
            </>
          ))}
        </div>
      </div>

      {/* Access control */}
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
```

- [ ] **Step 2: Commit**

```bash
cd d:/utm/TMPP/delivery-frontend && git add src/pages/ProtectedOrdersPage.tsx && git commit -m "update protected orders page with proxy matrix and role simulation"
```

---

## Task 13: Clean up App.css (remove stale styles)

**Files:**
- Modify: `src/App.css`

- [ ] **Step 1: Empty App.css (all styles now in index.css)**

```css
/* styles moved to index.css */
```

- [ ] **Step 2: Commit**

```bash
cd d:/utm/TMPP/delivery-frontend && git add src/App.css && git commit -m "remove stale styles from App.css"
```

---

## Task 14: Build and verify

- [ ] **Step 1: Run TypeScript check and build**

```bash
cd d:/utm/TMPP/delivery-frontend && npm run build
```

Expected: `✓ built in X.XXs` with no errors. Fix any TypeScript type errors before proceeding.

- [ ] **Step 2: Commit build success (no artifact — just verify)**

No commit needed for build output. If build passes, push all commits:

```bash
cd d:/utm/TMPP/delivery-frontend && git push
```

---

## Task 15: Push backend repo (no changes, just history check)

The backend requires no code changes for this redesign. Push any uncommitted state if needed.

- [ ] **Step 1: Check backend status**

```bash
cd d:/utm/TMPP/DeliverySystem && git status && git log --oneline -5
```

- [ ] **Step 2: Push if needed**

```bash
cd d:/utm/TMPP/DeliverySystem && git push
```
