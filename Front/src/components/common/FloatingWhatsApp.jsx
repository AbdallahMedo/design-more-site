import React from 'react';
import { MessageSquare } from 'lucide-react';
import { contactInfo } from '../../config/contactInfo';
import { useLanguage } from '../../context/LanguageContext';

export const FloatingWhatsApp = () => {
  const { language, isRTL, str } = useLanguage();
  const directLink = language === 'ar'
    ? `https://wa.me/${contactInfo.communication.whatsApp.number.replace('+', '')}?text=${encodeURIComponent(contactInfo.communication.whatsApp.defaultMessageAr)}`
    : contactInfo.communication.whatsApp.directLink;

  return (
    <aside
      aria-label="WhatsApp Concierge"
      style={{
        position: 'fixed',
        bottom: '24px',
        [isRTL ? 'left' : 'right']: '24px',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <a
        href={directLink}
        target="_blank"
        rel="noopener noreferrer"
        className="pulse-whatsapp"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
          fontWeight: 600,
          fontSize: '0.88rem',
          letterSpacing: '0.02em',
          textDecoration: 'none',
          transition: 'transform var(--transition-fast)',
        }}
        title={str('whatsAppConcierge')}
      >
        <MessageSquare size={20} fill="#FFFFFF" color="#25D366" />
        <span className="d-none-mobile">
          {language === 'ar' ? 'مستشار واتساب' : 'WhatsApp Concierge'}
        </span>
      </a>
    </aside>
  );
};

export default FloatingWhatsApp;
