import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav';
import Toast from '../components/common/Toast';

/**
 * DashboardLayout — sidebar + top bar layout for user/vendor/admin dashboards.
 * @param {{ variant?: 'user' | 'vendor' | 'admin' }} props
 */
export default function DashboardLayout({ variant = 'user' }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - hidden on mobile, shown on large screens */}
      <DashboardSidebar variant={variant} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader variant={variant} />
        {/* pb-20 on mobile to avoid content being hidden by bottom nav */}
        <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav - shown only on small screens */}
      <DashboardMobileNav variant={variant} />

      <Toast />
    </div>
  );
}
