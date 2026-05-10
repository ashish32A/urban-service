import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../../store/slices/authSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { toggleNav, selectIsNavOpen } from '../../store/slices/uiSlice';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isNavOpen = useSelector(selectIsNavOpen);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <nav className="container-app flex items-center justify-between h-16" aria-label="Main navigation">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            U
          </span>
          <span className="font-heading font-bold text-xl text-secondary-500">
            Urban<span className="text-primary-500">Serve</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 list-none">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 no-underline ${
                    isActive ? 'text-primary-500' : 'text-secondary-500 hover:text-primary-500'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-secondary-500">{user?.name?.split(' ')[0]}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card border border-gray-100 py-1 z-50 animate-fade-in">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-secondary-500 hover:bg-gray-50 no-underline" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                  <Link to="/dashboard/bookings" className="block px-4 py-2 text-sm text-secondary-500 hover:bg-gray-50 no-underline" onClick={() => setDropdownOpen(false)}>My Bookings</Link>
                  <Link to="/dashboard/profile" className="block px-4 py-2 text-sm text-secondary-500 hover:bg-gray-50 no-underline" onClick={() => setDropdownOpen(false)}>Profile</Link>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost text-sm">Login</Link>
              <Link to="/register" className="btn btn-primary text-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-btn"
          className="md:hidden p-2 rounded-lg text-secondary-500 hover:bg-gray-100"
          onClick={() => dispatch(toggleNav())}
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isNavOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isNavOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 animate-slide-up">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="block py-2 text-sm font-medium text-secondary-500 hover:text-primary-500 no-underline"
              onClick={() => dispatch(toggleNav())}
            >
              {label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="mt-2 w-full btn btn-outline text-sm">
              Sign Out
            </button>
          ) : (
            <div className="flex flex-col gap-2 mt-3">
              <Link to="/login" className="btn btn-ghost text-sm">Login</Link>
              <Link to="/register" className="btn btn-primary text-sm">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
