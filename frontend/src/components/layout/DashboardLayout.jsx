import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Mobile sidebar overlay ────────────────────────────────── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <div
          className={[
            'fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out',
            'md:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          ].join(' ')}
        >
          <Sidebar />
        </div>

        {/* ── Main content ──────────────────────────────────────────── */}
        <main className="flex-1 overflow-auto">
          {/* Mobile sidebar toggle (inside content area) */}
          <div className="md:hidden flex items-center px-4 pt-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
