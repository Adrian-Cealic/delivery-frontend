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
