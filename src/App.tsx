import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, ShoppingCart, Users, Bike, Truck,
  PackagePlus, BarChart2, ShieldCheck,
  Layers, GitBranch, Factory, Combine, Puzzle,
  TreePine, Component, Repeat, Maximize2, Sparkles,
  type LucideIcon,
} from 'lucide-react'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import CustomersPage from './pages/CustomersPage'
import CouriersPage from './pages/CouriersPage'
import DeliveriesPage from './pages/DeliveriesPage'
import PlaceOrderPage from './pages/PlaceOrderPage'
import ReportsPage from './pages/ReportsPage'
import ProtectedOrdersPage from './pages/ProtectedOrdersPage'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  pattern?: string
}

const NAV_OPERATIONS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/couriers', label: 'Couriers', icon: Bike },
  { to: '/deliveries', label: 'Deliveries', icon: Truck },
  { to: '/place-order', label: 'Place Order', icon: PackagePlus },
  { to: '/reports', label: 'Reports', icon: BarChart2 },
  { to: '/protected-orders', label: 'Protected Orders', icon: ShieldCheck },
]

const NAV_LAB4: NavItem[] = [
  { to: '/orders', label: 'Prototype', icon: Layers, pattern: 'Prototype' },
  { to: '/orders', label: 'Builder', icon: GitBranch, pattern: 'Builder' },
  { to: '/couriers', label: 'Factory Method', icon: Factory, pattern: 'Factory' },
  { to: '/place-order', label: 'Facade', icon: Combine, pattern: 'Façade' },
  { to: '/place-order', label: 'Adapter', icon: Puzzle, pattern: 'Adapter' },
  { to: '/place-order', label: 'Composite', icon: TreePine, pattern: 'Composite' },
  { to: '/reports', label: 'Bridge', icon: Component, pattern: 'Bridge' },
  { to: '/protected-orders', label: 'Proxy', icon: ShieldCheck, pattern: 'Proxy' },
  { to: '/couriers', label: 'Flyweight', icon: Repeat, pattern: 'Flyweight' },
  { to: '/deliveries', label: 'Decorator', icon: Sparkles, pattern: 'Decorator' },
]

const NAV_LAB5: NavItem[] = [
  { to: '/orders', label: 'Observer', icon: Maximize2, pattern: 'Observer' },
]

function SidebarSection({ title, items }: { title: string; items: NavItem[] }) {
  const location = useLocation()
  return (
    <div className="mb-4">
      <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        {title}
      </p>
      {items.map(item => {
        const Icon = item.icon
        const isActive = item.to === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(item.to)
        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={cn(
              'flex items-center gap-2.5 rounded-md mx-1 px-2.5 py-1.5 text-sm transition-colors',
              isActive
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300'
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 truncate">{item.label}</span>
            {item.pattern && (
              <span className="rounded bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-indigo-400">
                {item.pattern}
              </span>
            )}
          </NavLink>
        )
      })}
    </div>
  )
}

export default function App() {
  const location = useLocation()

  const pageTitle = (() => {
    const path = location.pathname
    if (path === '/') return 'Dashboard'
    if (path === '/orders') return 'Orders'
    if (path === '/customers') return 'Customers'
    if (path === '/couriers') return 'Couriers'
    if (path === '/deliveries') return 'Deliveries'
    if (path === '/place-order') return 'Place Order'
    if (path === '/reports') return 'Reports'
    if (path === '/protected-orders') return 'Protected Orders'
    return 'Delivery System'
  })()

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600">
            <Truck className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-zinc-100">DeliveryOS</p>
            <p className="text-[10px] text-zinc-600 leading-none mt-0.5">Pattern Explorer</p>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-none">
          <SidebarSection title="Operations" items={NAV_OPERATIONS} />
          <SidebarSection title="Lab 4 — Structural" items={NAV_LAB4} />
          <SidebarSection title="Lab 5 — Behavioral" items={NAV_LAB5} />
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-12 shrink-0 items-center border-b border-zinc-800 bg-zinc-950 px-6">
          <span className="text-sm font-medium text-zinc-400">DeliveryOS</span>
          <span className="mx-2 text-zinc-700">/</span>
          <span className="text-sm font-medium text-zinc-100">{pageTitle}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/couriers" element={<CouriersPage />} />
            <Route path="/deliveries" element={<DeliveriesPage />} />
            <Route path="/place-order" element={<PlaceOrderPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/protected-orders" element={<ProtectedOrdersPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
