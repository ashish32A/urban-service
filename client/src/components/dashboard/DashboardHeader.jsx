import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const TITLES = {
  user: 'My Dashboard',
  vendor: 'Vendor Dashboard',
  admin: 'Admin Dashboard',
};

export default function DashboardHeader({ variant = 'user' }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-base font-semibold text-secondary-500">{TITLES[variant]}</h1>

      <div className="flex items-center gap-4">
        {/* Notification bell placeholder */}
        <button className="relative p-2 text-gray-400 hover:text-secondary-500 rounded-lg hover:bg-gray-100" aria-label="Notifications">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="text-sm font-medium text-secondary-500 hidden sm:block">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </div>

        <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">
          Logout
        </button>
      </div>
    </header>
  );
}
