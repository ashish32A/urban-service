import { NavLink } from 'react-router-dom';

const NAV_CONFIGS = {
  user: [
    { label: 'Overview', to: '/dashboard', icon: '🏠', end: true },
    { label: 'My Bookings', to: '/dashboard/bookings', icon: '📋' },
    { label: 'Profile', to: '/dashboard/profile', icon: '👤' },
  ],
  vendor: [
    { label: 'Overview', to: '/vendor', icon: '🏠', end: true },
    { label: 'Bookings', to: '/vendor/bookings', icon: '📋' },
    { label: 'Earnings', to: '/vendor/earnings', icon: '💰' },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin', icon: '📊', end: true },
    { label: 'Users', to: '/admin/users', icon: '👥' },
    { label: 'Services', to: '/admin/services', icon: '🛠' },
  ],
};

const VARIANT_STYLES = {
  user: 'from-secondary-500 to-secondary-600',
  vendor: 'from-accent-600 to-accent-700',
  admin: 'from-primary-600 to-primary-700',
};

export default function DashboardSidebar({ variant = 'user' }) {
  const links = NAV_CONFIGS[variant] || NAV_CONFIGS.user;
  const gradient = VARIANT_STYLES[variant];

  return (
    <aside
      className={`hidden lg:flex flex-col w-60 min-h-screen bg-gradient-to-b ${gradient} text-white`}
      aria-label="Dashboard navigation"
    >
      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/10">
        <span className="font-heading font-bold text-lg">
          Urban<span className="text-white/70">Serve</span>
        </span>
        <p className="text-xs text-white/50 mt-0.5 capitalize">{variant} Panel</p>
      </div>

      {/* Links */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1 list-none p-0">
          {links.map(({ label, to, icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 no-underline
                  ${isActive ? 'bg-white/20 text-white shadow-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
                }
              >
                <span className="text-base">{icon}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-white/10">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 no-underline transition-all"
        >
          <span>↩</span> Back to Site
        </NavLink>
      </div>
    </aside>
  );
}
