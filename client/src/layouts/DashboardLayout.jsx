import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Toast from '../components/common/Toast';

/**
 * DashboardLayout — sidebar + top bar layout for user/vendor/admin dashboards.
 * @param {{ variant?: 'user' | 'vendor' | 'admin' }} props
 */
export default function DashboardLayout({ variant = 'user' }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar variant={variant} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader variant={variant} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Toast />
    </div>
  );
}
