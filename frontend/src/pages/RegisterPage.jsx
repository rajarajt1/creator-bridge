import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useForm } from '../hooks/useForm.js';

function RegisterPage() {
  const { register, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { values, handleChange } = useForm({ name: '', email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(values);
  };

  return (
    <main style={{ maxWidth: '400px', margin: '4rem auto', padding: '0 1rem' }}>
      <h2>Create Account</h2>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={values.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 8 characters)"
          value={values.password}
          onChange={handleChange}
          minLength={8}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
    </main>
  );
}

export default RegisterPage;
