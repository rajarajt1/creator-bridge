import { useAuth } from '../hooks/useAuth.js';

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>
      <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
        Welcome back, {user?.name || 'Creator'}!
      </p>
      <button
        onClick={logout}
        style={{ marginTop: '1.5rem' }}
      >
        Sign Out
      </button>
    </main>
  );
}

export default DashboardPage;
