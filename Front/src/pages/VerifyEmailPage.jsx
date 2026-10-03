import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const { verifyEmail, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await verifyEmail(email, otp);
      setSuccess('Account verified successfully! Redirecting to dashboard...');
      setTimeout(() => navigate('/account'), 1500);
    } catch (err) {
      setError('Verification code is invalid or expired.');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--surface-base)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1rem' }}>
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '440px', 
          backgroundColor: 'var(--surface-raised)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-subtle)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-level-2)',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <CheckCircle2 size={44} color="var(--brand-bronze)" />
        </div>

        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Verify Email Address
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
          Enter the 6-digit OTP sent to <strong>{email || 'your email'}</strong>
        </p>

        {error && (
          <div style={{ backgroundColor: 'rgba(158, 58, 43, 0.08)', color: 'var(--color-error)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: 'rgba(45, 106, 79, 0.08)', color: 'var(--color-success)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!emailParam && (
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nour@example.com"
            />
          )}

          <input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="482910"
            style={{
              fontSize: '1.5rem',
              letterSpacing: '0.4em',
              textAlign: 'center',
              fontWeight: 700,
              padding: '12px',
            }}
          />

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
