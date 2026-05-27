import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#fff',
    }}>
      <Link to="/" style={{ fontWeight: '700', fontSize: '1.25rem' }}>
        Creators Bridge
      </Link>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
