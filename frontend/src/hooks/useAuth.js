import { useEffect } from 'react';
import useAuthStore from '../store/authStore.js';

/**
 * useAuth
 *
 * Thin wrapper around authStore that also bootstraps the session on first
 * mount: if an access token is present but the user object hasn't been
 * loaded yet (e.g. after a page refresh), it fires `getMe` automatically.
 *
 * Returns the subset of auth state + actions needed by most components.
 */
const useAuth = () => {
  const user            = useAuthStore((s) => s.user);
  const accessToken     = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading       = useAuthStore((s) => s.isLoading);
  const login           = useAuthStore((s) => s.login);
  const logout          = useAuthStore((s) => s.logout);
  const register        = useAuthStore((s) => s.register);
  const getMe           = useAuthStore((s) => s.getMe);

  useEffect(() => {
    // Token exists but user data hasn't been hydrated yet (e.g. page refresh)
    if (accessToken && !user) {
      getMe().catch(() => {
        // Silently ignore — the axios interceptor handles 401 token cleanup
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run only once on mount

  return { user, isAuthenticated, isLoading, login, logout, register };
};

export default useAuth;
