import { apiAssetUrl } from '../../config/api';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatEGP } from '../../utils/bilingual';

export const CartDrawer = () => {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const { language, isRTL, str, t } = useLanguage();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex' }}>
      {/* Backdrop */}
      <div 
        onClick={closeDrawer}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(31, 36, 33, 0.45)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity var(--transition-normal)',
        }}
      />

      {/* Drawer Surface */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          [isRTL ? 'left' : 'right']: 0,
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--surface-raised)',
          boxShadow: 'var(--shadow-level-4)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
          animation: 'fadeIn 0.25s ease',
        }}
      >
        {/* Drawer Header */}
        <div 
          className="hairline-b" 
          style={{ 
            padding: '1.25rem 1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--brand-bronze)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 500 }}>
              {str('shoppingBag')} ({itemCount})
            </h3>
          </div>
          <button 
            onClick={closeDrawer} 
            style={{ padding: '6px', color: 'var(--text-primary)' }}
            aria-label="Close Shopping Bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {items.length === 0 ? (
            <div 
              style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                gap: '1rem',
                color: 'var(--text-tertiary)'
              }}
            >
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: 'var(--radius-full)', 
                  backgroundColor: 'var(--surface-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShoppingBag size={28} color="var(--brand-bronze)" />
              </div>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {str('cartEmpty')}
                </p>
                <p style={{ fontSize: '0.85rem' }}>
                  {str('cartEmptyDesc')}
                </p>
              </div>
              <button 
                onClick={() => { closeDrawer(); navigate('/shop'); }}
                className="btn btn-primary"
                style={{ marginTop: '0.5rem', padding: '0.65rem 1.5rem' }}
              >
                {str('continueShopping')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {items.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    alignItems: 'center'
                  }}
                >
                  {/* Thumbnail */}
                  <div 
                    style={{ 
                      width: '74px', 
                      height: '92px', 
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      backgroundColor: 'var(--surface-container)',
                      flexShrink: 0
                    }}
                  >
                    <img 
                      src={apiAssetUrl(item.imageUrl)} 
                      alt={item.titleEn} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 
                      style={{ 
                        fontSize: '0.92rem', 
                        fontWeight: 600, 
                        lineHeight: 1.3,
                        marginBottom: '0.25rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {t(item, 'title')}
                    </h4>
                    
                    <div style={{ color: 'var(--brand-bronze-dark)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                      {formatEGP(item.price, language)}
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                          style={{ padding: '4px 8px', color: 'var(--text-secondary)' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0 8px' }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ padding: '4px 8px', color: 'var(--text-secondary)' }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        style={{ color: 'var(--text-tertiary)', padding: '4px' }}
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Subtotal & Checkout */}
        {items.length > 0 && (
          <div 
            className="hairline-t" 
            style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--surface-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                {str('subtotal')}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {formatEGP(subtotal, language)}
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', margin: 0 }}>
              {language === 'ar' 
                ? 'يتم احتساب رسوم الشحن بدقة في صفحة تأكيد الطلب بحسب المحافظة.' 
                : 'Governorate delivery fee is calculated at checkout.'}
            </p>

            <button 
              onClick={() => {
                closeDrawer();
                navigate('/checkout');
              }}
              className="btn btn-primary"
              style={{ width: '100%', gap: '0.6rem', padding: '0.85rem' }}
            >
              <span>{str('proceedToCheckout')}</span>
              {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
