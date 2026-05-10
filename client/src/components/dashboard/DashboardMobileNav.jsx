import { NavLink } from 'react-router-dom';

const NAV_CONFIGS = {
  user: [
    { label: 'Home', to: '/dashboard', icon: '🏠', end: true },
    { label: 'Bookings', to: '/dashboard/bookings', icon: '📋' },
    { label: 'Profile', to: '/dashboard/profile', icon: '👤' },
  ],
  vendor: [
    { label: 'Home', to: '/vendor', icon: '🏠', end: true },
    { label: 'Bookings', to: '/vendor/bookings', icon: '📋' },
    { label: 'Earnings', to: '/vendor/earnings', icon: '💰' },
  ],
  admin: [
    { label: 'Home', to: '/admin', icon: '📊', end: true },
    { label: 'Users', to: '/admin/users', icon: '👥' },
    { label: 'Services', to: '/admin/services', icon: '🛠' },
  ],
};

export default function DashboardMobileNav({ variant = 'user' }) {
  const links = NAV_CONFIGS[variant] || NAV_CONFIGS.user;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <ul className="flex items-center justify-around list-none p-0 m-0">
        {links.map(({ label, to, icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 transition-all duration-200 no-underline
                ${isActive ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'}`
              }
            >
              <span className="text-xl">{icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
