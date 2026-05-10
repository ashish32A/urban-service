import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';

/**
 * AuthLayout — wraps login/register pages.
 * Redirects to home if already authenticated.
 */
export default function AuthLayout() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-500 via-secondary-600 to-secondary-700 px-4">
      {/* Decorative blobs */}
      <div
        className="absolute top-0 left-0 w-72 h-72 bg-primary-500 opacity-10 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500 opacity-10 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-heading font-bold text-white">
            Urban<span className="text-primary-400">Serve</span>
          </span>
          <p className="text-secondary-300 text-sm mt-1">Trusted home services at your doorstep</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
