import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import { PageLoader } from '../ui/Loader.jsx';

/** Maps each role to its home dashboard */
const ROLE_DASHBOARD = {
  creator:  '/dashboard',
  business: '/business-dashboard',
};

/**
 * RoleBasedRedirect
 *
 * Use this as the element for routes that should transparently send an
 * authenticated user to the correct dashboard based on their role.
 * Unauthenticated users are redirected to /login.
 */
const RoleBasedRedirect = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading       = useAuthStore((s) => s.isLoading);
  const user            = useAuthStore((s) => s.user);

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const destination = ROLE_DASHBOARD[user?.role] ?? '/dashboard';
  return <Navigate to={destination} replace />;
};

export default RoleBasedRedirect;
