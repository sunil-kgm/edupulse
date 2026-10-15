import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <main className="main-content">
        <TopHeader onMenuToggle={() => setMobileOpen(v => !v)} />
        <div className="page-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
