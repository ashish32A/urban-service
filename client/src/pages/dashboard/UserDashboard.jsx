import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const user = useSelector(selectUser);
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-heading font-bold text-secondary-500 mb-1">
        Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
      </h2>
      <p className="text-gray-500 mb-8">Here's what's happening with your account.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { label: 'Total Bookings', value: '0', icon: '📋', to: '/dashboard/bookings' },
          { label: 'Completed', value: '0', icon: '✅', to: '/dashboard/bookings' },
          { label: 'Upcoming', value: '0', icon: '📅', to: '/dashboard/bookings' },
        ].map(({ label, value, icon, to }) => (
          <Link key={label} to={to} className="card card-body flex items-center gap-4 no-underline group">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-primary-100 transition-colors">
              {icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-500">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
