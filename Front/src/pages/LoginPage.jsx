import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const { str } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--surface-base)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '440px', 
          backgroundColor: 'var(--surface-raised)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-subtle)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-level-2)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src={`${import.meta.env.BASE_URL}logo/logo-hq.png`} 
            alt="Design & More" 
            style={{ height: 'auto', width: '240px', maxWidth: '100%', objectFit: 'contain', margin: '0 auto 1.25rem' }}
          />
          <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            Client Sign In
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Access orders, architectural drawings & custom inquiries
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(158, 58, 43, 0.08)', color: 'var(--color-error)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@studio.eg"
                style={{ paddingLeft: '38px' }}
              />
              <Mail size={16} color="var(--brand-bronze)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: '38px' }}
              />
              <Lock size={16} color="var(--brand-bronze)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : str('login')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--brand-bronze-dark)', fontWeight: 600 }}>
            {str('register')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
