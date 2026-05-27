import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import { PageLoader } from '../ui/Loader.jsx';

/** Maps a user role to its home dashboard path */
const ROLE_DASHBOARD = {
  creator:  '/dashboard',
  business: '/business-dashboard',
};

/**
 * ProtectedRoute
 *
 * Props:
 *   children     – route content to render when access is granted
 *   allowedRoles – optional string[] of roles that may access this route;
 *                  omit to allow any authenticated user
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading       = useAuthStore((s) => s.isLoading);
  const user            = useAuthStore((s) => s.user);
  const location        = useLocation();

  // Still resolving auth state (e.g. getMe in-flight on first load)
  if (isLoading) return <PageLoader />;

  // Not logged in → send to /login, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role → bounce to the correct dashboard
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const fallback = ROLE_DASHBOARD[user.role] ?? '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
