import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageSquare, ArrowRight, ArrowLeft, Printer, ShoppingBag } from 'lucide-react';
import { ordersApi } from '../api/ordersApi';
import { contactInfo } from '../config/contactInfo';
import { useLanguage } from '../context/LanguageContext';
import { formatEGP } from '../utils/bilingual';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { language, isRTL, str } = useLanguage();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#9E7D53', '#B8976C', '#1F2421', '#FBF9F5'],
      });
    } catch (e) {
      // safe fallback
    }

    if (!order && id) {
      const fetchOrder = async () => {
        const data = await ordersApi.getOrderById(id);
        setOrder(data);
        setLoading(false);
      };
      fetchOrder();
    }
  }, [id]);

  const orderNum = order?.orderNumber || id;
  const whatsAppCoordinateUrl = `https://wa.me/${contactInfo.communication.whatsApp.number.replace('+', '')}?text=${encodeURIComponent(
    `Hello Design & More team, I have placed order ${orderNum}. I would like to coordinate delivery details.`
  )}`;

  return (
    <div style={{ backgroundColor: 'var(--surface-base)', minHeight: '80vh', padding: '4rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div 
          style={{ 
            backgroundColor: 'var(--surface-raised)', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-subtle)',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            boxShadow: 'var(--shadow-level-2)',
            textAlign: 'center'
          }}
        >
          {/* Success Check Icon */}
          <div 
            style={{ 
              width: '68px', 
              height: '68px', 
              borderRadius: 'var(--radius-full)', 
              backgroundColor: 'rgba(45, 106, 79, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--color-success)'
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <span className="badge badge-bronze" style={{ marginBottom: '0.75rem' }}>
            Commission Received
          </span>

          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            {str('orderSuccess')}
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto 2rem' }}>
            {str('orderNotice')}
          </p>

          {/* Receipt Header Card */}
          <div 
            style={{ 
              backgroundColor: 'var(--surface-subtle)', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border-subtle)',
              padding: '1.25rem 1.75rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'start',
              marginBottom: '2rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                {str('orderNumber')}
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--brand-bronze-dark)', letterSpacing: '0.04em' }}>
                {orderNum}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                Payment Method
              </span>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Cash on Delivery (COD)
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                {str('total')}
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatEGP(order?.total || 14575, language)}
              </div>
            </div>
          </div>

          {/* Recipient Details */}
          {order && (
            <div 
              style={{ 
                textAlign: 'start', 
                padding: '1.25rem 1.75rem', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 'var(--radius-sm)',
                marginBottom: '2.5rem',
                fontSize: '0.88rem',
                lineHeight: 1.7
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Delivery Destination:
              </div>
              <div>{order.customerName} ({order.phoneNumber})</div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {order.address}, {order.city}, {order.governorate}
              </div>
              {order.customerNotes && (
                <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                  Note: "{order.customerNotes}"
                </div>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <a
              href={whatsAppCoordinateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.8rem', gap: '0.6rem', backgroundColor: '#25D366', borderColor: '#25D366' }}
            >
              <MessageSquare size={17} />
              <span>{str('chatWhatsAppOrder')}</span>
            </a>

            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.5rem', gap: '0.5rem' }}
            >
              <Printer size={16} />
              <span>Print Specification Receipt</span>
            </button>

            <Link
              to="/shop"
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.5rem', gap: '0.5rem' }}
            >
              <ShoppingBag size={16} />
              <span>{str('continueShopping')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
