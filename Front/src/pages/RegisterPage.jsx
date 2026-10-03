import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const RegisterPage = () => {
  const { register, loading } = useAuth();
  const { language, str } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Egyptian phone check
    const egRegex = /^01[0125][0-9]{8}$/;
    if (!egRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      setError(language === 'ar' ? 'يرجى إدخال رقم هاتف مصري صحيح (11 رقم يبدأ بـ 01).' : 'Please enter a valid 11-digit Egyptian phone number starting with 01.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        phoneNumber,
        whatsAppNumber: whatsAppNumber || phoneNumber,
      });
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--surface-base)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1rem' }}>
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '460px', 
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
            {str('register')}
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Join Design & More Client Collective
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(158, 58, 43, 0.08)', color: 'var(--color-error)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              {str('fullName')} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Eng. Nour El-Din"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nour@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              {str('phoneNumber')} *
            </label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="01001234567"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              Password (8+ characters) *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Creating Account...' : str('register')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--brand-bronze-dark)', fontWeight: 600 }}>
            {str('login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
