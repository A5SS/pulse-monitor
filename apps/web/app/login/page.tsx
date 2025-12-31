'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login...', { email });
      const result = await login(email, password);
      console.log('Login result:', result);
      if (result && result.accessToken) {
        router.push('/dashboard');
      } else {
        setError('Login failed: Invalid response');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMsg = err.message || 'Login failed. Please check if API server is running on http://localhost:4000';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '28rem', width: '100%', padding: '2rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <div>
          <h2 style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '1.875rem', fontWeight: '800', color: '#111827' }}>
            Pulse Monitor
          </h2>
          <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
            Sign in to your account
          </p>
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.25rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '0.5rem 1rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: '0.375rem',
                color: 'white',
                backgroundColor: loading ? '#9ca3af' : '#4f46e5',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', textAlign: 'center', color: '#6b7280' }}>
            Default: admin@pulse-monitor.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
