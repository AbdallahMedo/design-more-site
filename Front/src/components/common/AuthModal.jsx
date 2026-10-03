import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const AuthModal = () => {
  const { authModalState, closeAuthModal, login, register, verifyEmail, loading } = useAuth();
  const { language, str } = useLanguage();
  const [tab, setTab] = useState(authModalState.tab || 'login'); // 'login' | 'register' | 'verify'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regWhatsApp, setRegWhatsApp] = useState('');

  const [verifyOtp, setVerifyOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  if (!authModalState.isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Egyptian phone validation
    const egRegex = /^01[0125][0-9]{8}$/;
    if (!egRegex.test(regPhone)) {
      setError(language === 'ar' ? 'يرجى إدخال رقم هاتف مصري صحيح (11 رقم يبدأ بـ 01).' : 'Please enter a valid 11-digit Egyptian phone number starting with 01.');
      return;
    }

    if (regPassword.length < 8) {
      setError(language === 'ar' ? 'كلمة المرور يجب ألا تقل عن 8 خانات.' : 'Password must be at least 8 characters.');
      return;
    }

    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phoneNumber: regPhone,
        whatsAppNumber: regWhatsApp || regPhone,
      });
      setPendingEmail(regEmail);
      setTab('verify');
      setSuccess(language === 'ar' ? 'تم إنشاء الحساب بنجاح. أدخل رمز التحقق المرسل لبريدك الإلكتروني.' : 'Account created. Please enter the verification OTP sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please verify your data.');
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await verifyEmail(pendingEmail, verifyOtp);
      setSuccess(language === 'ar' ? 'تم تفعيل الحساب بنجاح!' : 'Email verified successfully!');
      setTimeout(() => closeAuthModal(), 1200);
    } catch (err) {
      setError('Verification code is invalid or expired.');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* Backdrop */}
      <div 
        onClick={closeAuthModal}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(31, 36, 33, 0.65)',
          backdropFilter: 'blur(5px)',
        }}
      />

      {/* Modal Surface */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--surface-raised)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-level-4)',
          overflow: 'hidden',
          zIndex: 1201,
          animation: 'fadeIn 0.25s ease',
        }}
      >
        {/* Header & Logo */}
        <div style={{ padding: '2rem 2rem 1.25rem', textAlign: 'center', position: 'relative' }}>
          <button 
            onClick={closeAuthModal}
            style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--text-tertiary)' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <img 
            src={`${import.meta.env.BASE_URL}logo/logo-hq.png`} 
            alt="Design & More" 
            style={{ height: 'auto', width: '240px', maxWidth: '100%', objectFit: 'contain', margin: '0 auto 1rem' }}
          />

          {/* Tab Selector */}
          {tab !== 'verify' && (
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                backgroundColor: 'var(--surface-subtle)',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
                marginTop: '1rem'
              }}
            >
              <button
                type="button"
                onClick={() => { setTab('login'); setError(''); }}
                style={{
                  padding: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: tab === 'login' ? 'var(--surface-raised)' : 'transparent',
                  color: tab === 'login' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: tab === 'login' ? 'var(--shadow-level-1)' : 'none',
                }}
              >
                {str('login')}
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setError(''); }}
                style={{
                  padding: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: tab === 'register' ? 'var(--surface-raised)' : 'transparent',
                  color: tab === 'register' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: tab === 'register' ? 'var(--shadow-level-1)' : 'none',
                }}
              >
                {str('register')}
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div style={{ padding: '0 2rem 2rem' }}>
          {error && (
            <div 
              style={{ 
                backgroundColor: 'rgba(158, 58, 43, 0.08)', 
                color: 'var(--color-error)', 
                padding: '10px 14px', 
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                marginBottom: '1rem',
                border: '1px solid rgba(158, 58, 43, 0.2)'
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div 
              style={{ 
                backgroundColor: 'rgba(45, 106, 79, 0.08)', 
                color: 'var(--color-success)', 
                padding: '10px 14px', 
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                marginBottom: '1rem',
                border: '1px solid rgba(45, 106, 79, 0.2)'
              }}
            >
              {success}
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="architect@studio.eg"
                    style={{ paddingLeft: '38px' }}
                  />
                  <Mail size={16} color="var(--brand-bronze)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
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
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
              >
                {loading ? 'Authenticating...' : str('login')}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  {str('fullName')}
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Eng. Nour El-Din"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nour@example.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  {str('phoneNumber')}
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="01001234567"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Password (8+ characters)
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
              >
                {loading ? 'Creating Account...' : str('register')}
              </button>
            </form>
          )}

          {/* VERIFY EMAIL OTP FORM */}
          {tab === 'verify' && (
            <form onSubmit={handleVerifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CheckCircle2 size={42} color="var(--brand-bronze)" />
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Verify Email Address
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                  Please enter the 6-digit verification code sent to <strong>{pendingEmail}</strong>
                </p>
              </div>

              <input
                type="text"
                required
                maxLength={6}
                value={verifyOtp}
                onChange={(e) => setVerifyOtp(e.target.value)}
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
                disabled={loading || verifyOtp.length < 6}
                className="btn btn-bronze"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
