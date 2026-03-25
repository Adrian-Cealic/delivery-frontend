import { useState } from 'react';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import CouriersPage from './pages/CouriersPage';
import DeliveriesPage from './pages/DeliveriesPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import ReportsPage from './pages/ReportsPage';
import ProtectedOrdersPage from './pages/ProtectedOrdersPage';

type Page = 'customers' | 'orders' | 'couriers' | 'deliveries' | 'place' | 'reports' | 'protected';

const pages: { key: Page; label: string }[] = [
  { key: 'customers', label: 'Customers' },
  { key: 'orders', label: 'Orders' },
  { key: 'place', label: 'Place Order (Lab4)' },
  { key: 'couriers', label: 'Couriers' },
  { key: 'deliveries', label: 'Deliveries' },
  { key: 'reports', label: 'Reports (Lab5)' },
  { key: 'protected', label: 'Protected Orders (Lab5)' },
];

export default function App() {
  const [activePage, setActivePage] = useState<Page>('customers');

  const renderPage = () => {
    switch (activePage) {
      case 'customers': return <CustomersPage />;
      case 'orders': return <OrdersPage />;
      case 'place': return <PlaceOrderPage />;
      case 'couriers': return <CouriersPage />;
      case 'deliveries': return <DeliveriesPage />;
      case 'reports': return <ReportsPage />;
      case 'protected': return <ProtectedOrdersPage />;
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-title">Delivery System</div>
        <nav>
          {pages.map(p => (
            <button
              key={p.key}
              className={activePage === p.key ? 'active' : ''}
              onClick={() => setActivePage(p.key)}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
