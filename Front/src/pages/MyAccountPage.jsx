import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Compass, Lock, LogOut, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { ordersApi } from '../api/ordersApi';
import { customOrdersApi } from '../api/customOrdersApi';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatEGP } from '../utils/bilingual';

export const MyAccountPage = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { language, str } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'custom' | 'profile' | 'security'
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    const loadData = async () => {
      setLoadingData(true);
      const [ord, cust] = await Promise.all([
        ordersApi.getMyOrders(),
        customOrdersApi.getMyCustomOrders(),
      ]);
      setOrders(ord || []);
      setCustomOrders(cust || []);
      setLoadingData(false);
    };

    loadData();
  }, [isAuthenticated]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg({ text: '', isError: false });

    if (newPassword.length < 8) {
      setPwdMsg({ text: 'New password must be at least 8 characters.', isError: true });
      return;
    }

    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setPwdMsg({ text: 'Password successfully updated.', isError: false });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPwdMsg({ text: 'Failed to update password. Verify current password.', isError: true });
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: 'var(--surface-base)', padding: '6rem 0', minHeight: '75vh', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <User size={48} color="var(--brand-bronze)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Sign In to View Account</h2>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: '2rem' }}>
            Access your architectural orders, bespoke CAD enquiries, and private specifications.
          </p>
          <button onClick={() => openAuthModal('login')} className="btn btn-primary">
            Sign In to Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--surface-base)', minHeight: '80vh', padding: '3.5rem 0 6rem' }}>
      <div className="container">
        {/* User Banner */}
        <div 
          style={{ 
            backgroundColor: 'var(--surface-raised)', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-subtle)',
            padding: '2rem',
            marginBottom: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-level-1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div 
              style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: 'var(--radius-full)', 
                backgroundColor: 'var(--surface-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-bronze-dark)',
                fontWeight: 700,
                fontSize: '1.2rem'
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                {user?.name || 'Architectural Client'}
              </h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                {user?.email} • {user?.phoneNumber}
              </div>
            </div>
          </div>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="btn btn-secondary"
            style={{ gap: '0.5rem', fontSize: '0.82rem', padding: '0.6rem 1.2rem' }}
          >
            <LogOut size={15} />
            <span>{str('logout')}</span>
          </button>
        </div>

        {/* Layout: Tab Navigation & Content Pane */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem' }}>
          {/* Tabs Sidebar (3 cols) */}
          <div style={{ gridColumn: 'span 3' }} className="col-12-tablet">
            <div 
              style={{ 
                backgroundColor: 'var(--surface-raised)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-subtle)',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'orders' ? 600 : 500,
                  backgroundColor: activeTab === 'orders' ? 'var(--surface-container)' : 'transparent',
                  color: activeTab === 'orders' ? 'var(--brand-bronze-dark)' : 'var(--text-secondary)',
                  textAlign: 'start',
                }}
              >
                <Package size={17} />
                <span>{str('myOrders')} ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('custom')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'custom' ? 600 : 500,
                  backgroundColor: activeTab === 'custom' ? 'var(--surface-container)' : 'transparent',
                  color: activeTab === 'custom' ? 'var(--brand-bronze-dark)' : 'var(--text-secondary)',
                  textAlign: 'start',
                }}
              >
                <Compass size={17} />
                <span>{str('myCustomOrders')} ({customOrders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'security' ? 600 : 500,
                  backgroundColor: activeTab === 'security' ? 'var(--surface-container)' : 'transparent',
                  color: activeTab === 'security' ? 'var(--brand-bronze-dark)' : 'var(--text-secondary)',
                  textAlign: 'start',
                }}
              >
                <Lock size={17} />
                <span>{str('changePassword')}</span>
              </button>
            </div>
          </div>

          {/* Tab Content (9 cols) */}
          <div style={{ gridColumn: 'span 9' }} className="col-12-tablet">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {str('myOrders')}
                </h2>

                {orders.length === 0 ? (
                  <div style={{ padding: '3rem', backgroundColor: 'var(--surface-raised)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                    No order commissions placed yet.
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      style={{
                        backgroundColor: 'var(--surface-raised)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        padding: '1.5rem',
                        boxShadow: 'var(--shadow-level-1)',
                      }}
                    >
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                            {str('orderNumber')}
                          </span>
                          <div style={{ fontWeight: 700, color: 'var(--brand-bronze-dark)', fontSize: '1rem' }}>
                            {ord.orderNumber}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge badge-bronze">
                            {ord.orderStatus || 'PendingConfirmation'}
                          </span>
                        </div>

                        <div style={{ textAlign: 'end' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {formatEGP(ord.total, language)}
                          </span>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Destination: {ord.address}, {ord.city}, {ord.governorate}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* BESPOKE CUSTOM ORDERS TAB */}
            {activeTab === 'custom' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {str('myCustomOrders')}
                </h2>

                {customOrders.length === 0 ? (
                  <div style={{ padding: '3rem', backgroundColor: 'var(--surface-raised)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                    No bespoke enquiries submitted yet.
                  </div>
                ) : (
                  customOrders.map((co) => (
                    <div
                      key={co.id}
                      style={{
                        backgroundColor: 'var(--surface-raised)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        padding: '1.5rem',
                        boxShadow: 'var(--shadow-level-1)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--brand-bronze-dark)', fontSize: '0.92rem' }}>
                          {co.id}
                        </span>
                        <span className="badge badge-bronze">
                          {co.status || 'InReview'}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                        {co.description}
                      </p>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                        Submitted on: {new Date(co.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SECURITY / CHANGE PASSWORD TAB */}
            {activeTab === 'security' && (
              <div 
                style={{ 
                  backgroundColor: 'var(--surface-raised)', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid var(--border-subtle)',
                  padding: '2rem',
                  maxWidth: '520px'
                }}
              >
                <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  {str('changePassword')}
                </h2>

                {pwdMsg.text && (
                  <div 
                    style={{ 
                      padding: '10px 14px', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.85rem', 
                      marginBottom: '1rem',
                      backgroundColor: pwdMsg.isError ? 'rgba(158, 58, 43, 0.08)' : 'rgba(45, 106, 79, 0.08)',
                      color: pwdMsg.isError ? 'var(--color-error)' : 'var(--color-success)',
                    }}
                  >
                    {pwdMsg.text}
                  </div>
                )}

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                      {str('currentPassword')}
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                      {str('newPassword')} (8+ characters)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem', marginTop: '0.5rem' }}>
                    {str('updatePassword')}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
