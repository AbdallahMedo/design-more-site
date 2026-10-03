import { apiAssetUrl } from '../config/api';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, ArrowRight, AlertCircle, ShoppingBag } from 'lucide-react';
import { ordersApi } from '../api/ordersApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatEGP } from '../utils/bilingual';

export const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { language, isRTL, str, t } = useLanguage();
  const navigate = useNavigate();

  const [governorates, setGovernorates] = useState([]);
  const [selectedGovId, setSelectedGovId] = useState('');
  const [shippingCost, setShippingCost] = useState(75.00);

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [whatsAppNumber, setWhatsAppNumber] = useState(user?.whatsAppNumber || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadGovs = async () => {
      const data = await ordersApi.getGovernorates();
      setGovernorates(data || []);
      if (data && data.length > 0) {
        setSelectedGovId(data[0].name);
        setShippingCost(data[0].deliveryFee);
      }
    };
    loadGovs();
  }, []);

  const handleGovChange = (govName) => {
    setSelectedGovId(govName);
    const found = governorates.find((g) => g.name === govName);
    if (found) {
      setShippingCost(found.deliveryFee);
    }
  };

  const grandTotal = subtotal + shippingCost;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError(str('cartEmpty'));
      return;
    }

    // Phone validation
    const egRegex = /^01[0125][0-9]{8}$/;
    if (!egRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      setError(language === 'ar' ? 'يرجى إدخال رقم هاتف مصري صحيح (11 رقم يبدأ بـ 01).' : 'Please enter a valid 11-digit Egyptian phone number starting with 01.');
      return;
    }

    if (!isAuthenticated) {
      setError(language === 'ar' ? 'يرجى تسجيل الدخول أو إنشاء حساب لإتمام وتأكيد الطلب.' : 'Please sign in or create an account to place and confirm your order.');
      openAuthModal('login');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customerName,
        phoneNumber,
        whatsAppNumber: whatsAppNumber || phoneNumber,
        address,
        city,
        governorate: selectedGovId,
        customerNotes,
        subtotal,
        shippingCost,
        total: grandTotal,
        items: items.map((i) => ({
          productId: i.productId || i.id,
          productTitleEn: i.titleEn,
          productTitleAr: i.titleAr,
          unitPrice: i.price,
          quantity: i.quantity,
          totalPrice: i.price * i.quantity,
          imageUrl: i.imageUrl,
        })),
      };

      const result = await ordersApi.createOrder(orderPayload);
      clearCart();
      navigate(`/orders/${result.orderNumber || result.id}/success`, { state: { order: result } });
    } catch (err) {
      if (err.response?.status === 401) {
        setError(language === 'ar' ? 'جلسة الدخول منتهية. يرجى تسجيل الدخول مجدداً لإتمام الطلب.' : 'Please sign in or create an account to place your order.');
        openAuthModal('login');
      } else {
        setError(err.response?.data?.message || 'Failed to submit order. Please check connection.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--surface-base)', padding: '6rem 0', minHeight: '75vh', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <ShoppingBag size={48} color="var(--brand-bronze)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{str('cartEmpty')}</h2>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: '2rem' }}>{str('cartEmptyDesc')}</p>
          <Link to="/shop" className="btn btn-primary">{str('continueShopping')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--surface-base)', minHeight: '80vh', padding: '3.5rem 0 6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--text-primary)' }}>
            {str('checkoutTitle')}
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            White-glove delivery, crated architectural handling, and Cash on Delivery inspection.
          </p>
        </div>

        {error && (
          <div 
            style={{ 
              backgroundColor: 'rgba(158, 58, 43, 0.08)', 
              color: 'var(--color-error)', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.88rem',
              marginBottom: '2rem',
              border: '1px solid rgba(158, 58, 43, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3rem' }}>
            {/* Left Column: Client & Shipping Details (7 cols) */}
            <div style={{ gridColumn: 'span 7' }} className="col-12-tablet">
              <div 
                style={{ 
                  backgroundColor: 'var(--surface-raised)', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid var(--border-subtle)',
                  padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}
              >
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  {str('recipientDetails')}
                </h2>

                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    {str('fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Eng. Nour El-Din"
                  />
                </div>

                {/* Phone & WhatsApp */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
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
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      {str('whatsAppNumber')}
                    </label>
                    <input
                      type="tel"
                      value={whatsAppNumber}
                      onChange={(e) => setWhatsAppNumber(e.target.value)}
                      placeholder="01001234567"
                    />
                  </div>
                </div>

                {/* Governorate & City */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      {str('governorate')} *
                    </label>
                    <select
                      value={selectedGovId}
                      onChange={(e) => handleGovChange(e.target.value)}
                      required
                    >
                      {governorates.map((gov) => (
                        <option key={gov.id} value={gov.name}>
                          {language === 'ar' ? gov.nameAr : gov.name} — ({formatEGP(gov.deliveryFee, language)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      {str('city')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New Cairo / 5th Settlement"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    {str('address')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Building 42, Street 18, Diplomatic District"
                  />
                </div>

                {/* Customer Notes */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    {str('customerNotes')}
                  </label>
                  <textarea
                    rows={3}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Call 30 mins before arrival, service elevator available..."
                  />
                </div>

                {/* Payment Selection Box */}
                <div style={{ marginTop: '0.5rem', padding: '1.25rem', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {str('paymentMethod')}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <input type="radio" checked readOnly style={{ width: '18px', height: '18px', accentColor: 'var(--brand-bronze)', marginTop: '2px' }} />
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{str('cod')}</span>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{str('codNotice')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Placement (5 cols) */}
            <div style={{ gridColumn: 'span 5' }} className="col-12-tablet">
              <div 
                style={{ 
                  backgroundColor: 'var(--surface-raised)', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid var(--border-subtle)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  boxShadow: 'var(--shadow-level-1)'
                }}
              >
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  Commission Summary ({items.length})
                </h2>

                {/* Items preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '240px', overflowY: 'auto' }}>
                  {items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <img src={apiAssetUrl(item.imageUrl)} alt="" style={{ width: '48px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {t(item, 'title')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          Qty: {item.quantity} × {formatEGP(item.price, language)}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                        {formatEGP(item.price * item.quantity, language)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{str('subtotal')}</span>
                    <span style={{ fontWeight: 600 }}>{formatEGP(subtotal, language)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{str('deliveryFee')}</span>
                    <span style={{ fontWeight: 600, color: 'var(--brand-bronze-dark)' }}>{formatEGP(shippingCost, language)}</span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{str('total')}</span>
                    <span style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--brand-bronze-dark)' }}>
                      {formatEGP(grandTotal, language)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', gap: '0.6rem', marginTop: '0.5rem' }}
                >
                  <span>{submitting ? str('placingOrder') : str('placeOrder')}</span>
                  {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                  <ShieldCheck size={16} color="var(--brand-bronze)" />
                  <span>Your commission order is confirmed immediately with tracking.</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
