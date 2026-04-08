# Delivery Frontend — Full Redesign Spec

**Date:** 2026-04-08  
**Project:** `delivery-frontend` (React 19 + Vite + TypeScript)  
**Stack additions:** Tailwind CSS, shadcn/ui, lucide-react

---

## 1. Overview

Complete structural redesign of the delivery management frontend. The goal is a professional, user-friendly application with a Dark Pro aesthetic (Vercel/Linear style) that clearly presents a real delivery system. All design patterns (Lab 4 Structural, Lab 5 Behavioral) must remain visible and labeled within the UI — not as code comments, but as visible badge annotations on the relevant UI surfaces.

No emoji anywhere. All icons use lucide-react SVG components.

---

## 2. Technology Stack

| Layer | Choice | Reason |
|---|---|---|
| CSS framework | Tailwind CSS v3 | Utility-first, ships with shadcn |
| Component library | shadcn/ui | Radix UI primitives, dark mode built-in |
| Icons | lucide-react | Consistent SVG, no emoji |
| Existing | React 19 + Vite + TypeScript | Kept as-is |

Approach A (full Tailwind + shadcn) was chosen over hybrid or token-only approaches. The hybrid would leave two CSS systems in conflict; token-only prevents using shadcn components directly.

---

## 3. Visual Design System

### Color tokens (shadcn dark)
```
--background:       #09090b   (zinc-950)
--card:             #18181b   (zinc-900)
--border:           #27272a   (zinc-800)
--foreground:       #fafafa   (zinc-50)
--muted-foreground: #a1a1aa   (zinc-400)
--muted:            #71717a   (zinc-500)
--accent:           #6366f1   (indigo-500)
```

### Typography
- Font: system stack (`-apple-system, BlinkMacSystemFont, 'Inter'`)
- Body: 13px / zinc-400
- Labels: 12px uppercase, letter-spacing 0.05em
- Headings: 14-20px, font-weight 600-700

### Spacing & radius
- Border radius: `rounded-md` (6px) for inputs/badges, `rounded-lg` (8px) for cards
- Sidebar width: 220px fixed
- Card padding: 16px
- Table row height: ~36px

---

## 4. Layout Architecture

```
┌─────────────────────────────────────────────────┐
│  Sidebar (220px fixed)  │  Main area (flex-1)   │
│  ─────────────────────  │  ──────────────────── │
│  Logo + app name        │  Topbar (48px)         │
│                         │  ──────────────────── │
│  [Operations]           │  Page content          │
│    Dashboard            │  (scrollable)          │
│    Orders               │                        │
│    Customers            │                        │
│    Couriers             │                        │
│    Deliveries           │                        │
│    Place Order          │                        │
│    Reports              │                        │
│                         │                        │
│  [Lab 4 — Structural]   │                        │
│    Prototype            │                        │
│    Builder              │                        │
│    Factory Method       │                        │
│    Facade               │                        │
│    Adapter              │                        │
│    Composite            │                        │
│    Bridge               │                        │
│    Proxy                │                        │
│    Flyweight            │                        │
│    Decorator            │                        │
│                         │                        │
│  [Lab 5 — Behavioral]   │                        │
│    (existing items)     │                        │
└─────────────────────────────────────────────────┘
```

The sidebar uses grouped `<nav>` sections. Each nav item is a `<button>` or `<Link>` with hover `bg-zinc-800`, active `bg-zinc-800 text-white`, and a subtle left border accent when active.

The topbar shows the current page title + breadcrumb + optional action buttons.

---

## 5. Pages

### 5.1 Dashboard (new page)

Route: `/` (default)  
Pattern badge: none (operations page)

Four KPI stat cards in a 4-column grid:
- Active Orders (count + trend delta)
- In Transit (count)
- Available Couriers (count)
- Avg Delivery Time (minutes)

Below: **Recent Orders** table (last 10) with columns: Order ID, Customer, Status badge, Courier, Created At, Actions.

### 5.2 Orders

Route: `/orders`  
Pattern badges: **Prototype** (clone button), **Builder** (stepper)

Layout: card grid (2 columns on wide screens). Each order card contains:
- Order ID + customer name
- StatusStepper component (Placed → Assigned → Picked → Delivered) — Builder pattern
- Stat chips: priority badge, item count, total price
- Action buttons: View, Clone (Prototype), Cancel

Clone triggers `order.clone()` on the Prototype implementation and adds the cloned order to the list.

### 5.3 Customers

Route: `/customers`  
Standard data table with search input. Columns: ID, Name, Email, Phone, Order Count, Actions.

### 5.4 Couriers

Route: `/couriers`  
Pattern badge: **Factory Method** (vehicle type creates courier subtype), **Flyweight** (shared vehicle metadata)

Table with columns: ID, Name, Vehicle (badge: Bicycle / Car / Drone / Motorcycle), Status (Active / Offline / Maintenance), Deliveries, Actions.

Vehicle type badge color:
- Bicycle: indigo
- Car: green  
- Drone: yellow
- Motorcycle: zinc

### 5.5 Deliveries

Route: `/deliveries`  
Pattern badge: **Facade**, **Decorator**

Table showing active deliveries with status progress. Each row: Delivery ID, Order, Courier, Status stepper (compact), ETA, decorated metadata (priority ring if Express).

### 5.6 Place Order

Route: `/place-order`  
Pattern badges: **Composite** (catalog tree), **Facade** (order service), **Adapter** (payment)

Two-column split layout:
- **Left (40%)**: Product catalog tree — categories fold/expand (Composite). Each leaf item has an Add button.
- **Right (60%)**: Order form with Facade OrderService — customer selector, selected items list, address input, payment method toggle (Cash / Card / Digital Wallet — Adapter pattern), Submit button.

Payment Adapter renders different input fields per method type.

### 5.7 Reports

Route: `/reports`  
Pattern badge: **Bridge**

KPI row (4 metrics): Total Orders, Delivery Rate, Avg Time, Revenue.

Two charts side by side:
- Bar chart: deliveries per day (last 7 days)
- Donut chart: status breakdown (Delivered / In Transit / Failed)

Top Couriers table below.

Renderer toggle (Table / Bar Chart / Donut) demonstrates Bridge pattern: `ReportView` abstraction + swappable `TableRenderer`, `ChartRenderer`, `DonutRenderer` implementations.

### 5.8 Protected Orders

Route: `/protected-orders`  
Pattern badge: **Proxy**

Role selector buttons: Admin / Courier / None. Proxy checks role before rendering order data.

- Admin: sees full order matrix table (all columns including sensitive data)
- Courier: sees only assigned orders, no customer contact info
- None: blocked view with access denied message

Orange accent theme to visually distinguish this page as security-sensitive.

---

## 6. Shared Components

| Component | Description |
|---|---|
| `StatusStepper` | 4-step horizontal stepper with filled/active/pending states |
| `PatternBadge` | Small badge showing pattern name (e.g. "Builder"), indigo bg |
| `StatChip` | Inline chip: icon + value + label |
| `KpiCard` | Metric card with value, label, delta indicator |
| `DataTable` | Generic table wrapper with header/row/badge slots |
| `PageHeader` | Topbar section: title + breadcrumb + action slot |

All components use shadcn primitives (Card, Badge, Button, Table, Dialog, Input, Select, Tabs) as the base.

---

## 7. Routing

React Router v6. Routes defined in `App.tsx`:

```
/                    → DashboardPage
/orders              → OrdersPage
/customers           → CustomersPage
/couriers            → CouriersPage
/deliveries          → DeliveriesPage
/place-order         → PlaceOrderPage
/reports             → ReportsPage
/protected-orders    → ProtectedOrdersPage
/[pattern-routes]    → existing pattern demo pages (unchanged structure)
```

The sidebar `NavItem` component uses `useMatch` / `NavLink` to highlight the active route.

---

## 8. Data Layer

All data is mock/in-memory (no backend calls required for the redesign). Existing mock data files are kept and extended. Data types remain in `src/types/`. The backend (`DeliverySystem`) exists as a separate repo and is not part of this redesign scope.

---

## 9. File Structure Changes

```
src/
  index.css              ← replace with Tailwind directives + shadcn CSS vars
  App.tsx                ← replace with new sidebar layout + routing
  components/
    ui/                  ← shadcn auto-generated components (Button, Card, etc.)
    PatternBadge.tsx     ← new (replaces PatternBanner)
    StatusStepper.tsx    ← rewritten with Tailwind
    StatChip.tsx         ← rewritten with Tailwind
    KpiCard.tsx          ← new
    PageHeader.tsx       ← new
    DataTable.tsx        ← new
  pages/
    DashboardPage.tsx    ← new
    OrdersPage.tsx       ← rewrite
    CustomersPage.tsx    ← rewrite
    CouriersPage.tsx     ← rewrite
    DeliveriesPage.tsx   ← rewrite
    PlaceOrderPage.tsx   ← rewrite
    ReportsPage.tsx      ← rewrite
    ProtectedOrdersPage.tsx ← rewrite
```

---

## 10. Build Requirements

- `npm run build` must complete with zero errors and zero TypeScript errors
- No `any` types introduced
- All shadcn components initialized via `npx shadcn@latest add`
- Tailwind config must include `darkMode: 'class'` and content paths covering `./src/**/*.{ts,tsx}`

---

## 11. Commit Strategy

Realistic human-style commits, not "AI-style" bulk commits. Sequence:

1. `chore: install tailwind css and configure postcss`
2. `chore: install shadcn/ui and add base components`
3. `feat: redesign app layout with dark sidebar and topbar`
4. `feat: add dashboard page with kpi cards and recent orders`
5. `feat: redesign orders page with stepper and clone action`
6. `feat: redesign couriers and customers pages`
7. `feat: redesign deliveries and place order pages`
8. `feat: add reports page with bridge renderer toggle`
9. `feat: redesign protected orders page with proxy role check`
10. `refactor: replace css custom with tailwind across shared components`
