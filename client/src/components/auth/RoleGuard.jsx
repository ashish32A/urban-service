import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../store/slices/authSlice';

/**
 * RoleGuard — renders children only if user has an allowed role.
 * @param {{ allowedRoles: string[], children: React.ReactNode }} props
 */
export default function RoleGuard({ allowedRoles, children }) {
  const role = useSelector(selectUserRole);

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
