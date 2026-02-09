import { useState } from 'react';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import CouriersPage from './pages/CouriersPage';
import DeliveriesPage from './pages/DeliveriesPage';

type Page = 'customers' | 'orders' | 'couriers' | 'deliveries';

const pages: { key: Page; label: string }[] = [
  { key: 'customers', label: 'Customers' },
  { key: 'orders', label: 'Orders' },
  { key: 'couriers', label: 'Couriers' },
  { key: 'deliveries', label: 'Deliveries' },
];

export default function App() {
  const [activePage, setActivePage] = useState<Page>('customers');

  const renderPage = () => {
    switch (activePage) {
      case 'customers': return <CustomersPage />;
      case 'orders': return <OrdersPage />;
      case 'couriers': return <CouriersPage />;
      case 'deliveries': return <DeliveriesPage />;
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
