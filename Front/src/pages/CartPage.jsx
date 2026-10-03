import { apiAssetUrl } from '../config/api';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatEGP } from '../utils/bilingual';

export const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart();
  const { language, isRTL, str, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--surface-base)', minHeight: '80vh', padding: '3.5rem 0 6rem' }}>
      <div className="container">
        {/* Title */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', color: 'var(--text-primary)' }}>
            {str('shoppingBag')}
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            {itemCount} {language === 'ar' ? 'قطع مختارة' : 'architectural pieces reserved in your order session'}
          </p>
        </div>

        {items.length === 0 ? (
          <div 
            style={{ 
              textAlign: 'center', 
              padding: '6rem 2rem', 
              backgroundColor: 'var(--surface-raised)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            <div 
              style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: 'var(--radius-full)', 
                backgroundColor: 'var(--surface-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}
            >
              <ShoppingBag size={32} color="var(--brand-bronze)" />
            </div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {str('cartEmpty')}
            </h2>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              {str('cartEmptyDesc')}
            </p>
            <Link to="/shop" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
              {str('continueShopping')}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3rem' }}>
            {/* Items List (8 cols) */}
            <div style={{ gridColumn: 'span 8' }} className="col-12-tablet">
              <div 
                style={{ 
                  backgroundColor: 'var(--surface-raised)', 
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden'
                }}
              >
                {items.map((item, idx) => (
                  <div 
                    key={item.id} 
                    style={{ 
                      padding: '1.75rem', 
                      display: 'flex', 
                      gap: '1.5rem',
                      alignItems: 'center',
                      borderBottom: idx < items.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                    }}
                  >
                    <img 
                      src={apiAssetUrl(item.imageUrl)} 
                      alt={item.titleEn} 
                      style={{ width: '90px', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                        {t(item, 'title')}
                      </h3>
                      <div style={{ color: 'var(--brand-bronze-dark)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                        {formatEGP(item.price, language)}
                      </div>

                      {/* Quantity & Remove */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div 
                          style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            border: '1px solid var(--border-strong)',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--surface-base)'
                          }}
                        >
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ padding: '6px 12px', color: 'var(--text-secondary)' }}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, padding: '0 8px' }}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ padding: '6px 12px', color: 'var(--text-secondary)' }}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeItem(item.id)}
                          style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}
                        >
                          <Trash2 size={15} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    <div style={{ textAlign: isRTL ? 'left' : 'right', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                      {formatEGP(item.price * item.quantity, language)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/shop" style={{ color: 'var(--brand-bronze-dark)', fontWeight: 600, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {isRTL ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
                  <span>{str('continueShopping')}</span>
                </Link>

                <button 
                  onClick={clearCart} 
                  style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* Order Summary Right (4 cols) */}
            <div style={{ gridColumn: 'span 4' }} className="col-12-tablet">
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
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                  Order Summary
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{str('subtotal')}</span>
                  <span style={{ fontWeight: 600 }}>{formatEGP(subtotal, language)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{str('deliveryFee')}</span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Calculated at checkout</span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{str('total')}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.4rem', color: 'var(--brand-bronze-dark)' }}>
                    {formatEGP(subtotal, language)}
                  </span>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', gap: '0.6rem' }}
                >
                  <span>{str('proceedToCheckout')}</span>
                  {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
