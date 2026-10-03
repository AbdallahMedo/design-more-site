import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Phone, 
  MessageSquare, 
  Search, 
  User, 
  ShoppingBag, 
  Menu, 
  X, 
  Globe, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { contactInfo } from '../../config/contactInfo';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar = ({ onOpenSearch }) => {
  const { language, toggleLanguage, str, isRTL } = useLanguage();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { itemCount, openDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: str('home') },
    { to: '/shop', label: str('shop') },
    { to: '/custom-order', label: str('customOrder') },
    { to: '/about', label: str('about') },
    { to: '/contact', label: str('contact') },
  ];

  return (
    <header className="header-wrapper" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Utility Bar */}
      <div 
        className="hairline-b" 
        style={{ 
          backgroundColor: 'var(--surface-subtle)', 
          fontSize: '0.78rem',
          letterSpacing: '0.04em',
          padding: '7px 0',
          color: 'var(--text-secondary)'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: Contact Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <a 
              href={`tel:${contactInfo.communication.primaryPhone}`} 
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'inherit' }}
            >
              <Phone size={13} color="var(--brand-bronze)" />
              <span>{contactInfo.communication.primaryPhone}</span>
            </a>
            
            <a 
              href={contactInfo.communication.whatsApp.directLink}
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-success)', fontWeight: 500 }}
              className="d-none-mobile"
            >
              <MessageSquare size={13} />
              <span>{str('whatsAppConcierge')}</span>
            </a>
          </div>

          {/* Right: Tagline & Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ color: 'var(--text-tertiary)' }} className="d-none-mobile">
              {language === 'ar' ? contactInfo.brand.taglineAr : contactInfo.brand.taglineEn}
            </span>

            {/* Bilingual Switcher */}
            <button 
              onClick={toggleLanguage}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                fontWeight: 600,
                color: 'var(--text-primary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                backgroundColor: 'var(--surface-raised)'
              }}
              title="Toggle Language / تبديل اللغة"
            >
              <Globe size={13} color="var(--brand-bronze)" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav 
        style={{ 
          backgroundColor: scrolled ? 'rgba(251, 249, 245, 0.96)' : 'var(--surface-base)', 
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border-subtle)',
          transition: 'all var(--transition-normal)'
        }}
      >
        <div 
          className="container" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            height: '96px'
          }}
        >
          {/* Left: Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src={`${import.meta.env.BASE_URL}logo/logo-hq.png`} 
              alt="Design & More" 
              style={{ height: 'auto', width: '126px', objectFit: 'contain', flexShrink: 0, display: 'block' }}
            />
          </Link>

          {/* Center: Desktop Nav Links */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '2.2rem' 
            }}
            className="d-none-tablet"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--brand-bronze-dark)' : 'var(--text-primary)',
                  letterSpacing: '0.02em',
                  position: 'relative',
                  padding: '6px 0',
                })}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span 
                        style={{ 
                          position: 'absolute', 
                          bottom: 0, 
                          left: 0, 
                          right: 0, 
                          height: '2px', 
                          backgroundColor: 'var(--brand-bronze)' 
                        }} 
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right: Actions (Search, Account, Cart, Mobile Toggle) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Search Trigger */}
            <button 
              onClick={onOpenSearch}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                color: 'var(--text-primary)',
                padding: '8px',
                borderRadius: 'var(--radius-sm)'
              }}
              title={str('search')}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Account Link or Modal */}
            {isAuthenticated ? (
              <Link 
                to="/account" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  color: 'var(--text-primary)',
                  padding: '8px'
                }}
                title={user?.name || str('account')}
              >
                <User size={20} />
              </Link>
            ) : (
              <button 
                onClick={() => openAuthModal('login')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  color: 'var(--text-primary)',
                  padding: '8px'
                }}
                title={str('login')}
              >
                <User size={20} />
              </button>
            )}

            {/* Shopping Cart Drawer Trigger */}
            <button 
              onClick={openDrawer}
              style={{ 
                position: 'relative',
                display: 'flex', 
                alignItems: 'center', 
                color: 'var(--text-primary)',
                padding: '8px',
                borderRadius: 'var(--radius-sm)'
              }}
              title={str('shoppingBag')}
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={21} />
              {itemCount > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: 'var(--brand-bronze)',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              style={{ 
                display: 'none', 
                padding: '8px',
                color: 'var(--text-primary)'
              }}
              className="d-mobile-flex"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          style={{
            backgroundColor: 'var(--surface-raised)',
            borderBottom: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-level-3)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
          className="animate-fade-in"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontSize: '1.05rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
                padding: '8px 0',
                borderBottom: '1px solid var(--surface-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{link.label}</span>
              <ArrowRight size={16} color="var(--brand-bronze)" />
            </Link>
          ))}

          <div style={{ paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a 
              href={contactInfo.communication.whatsApp.directLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: '100%', gap: '0.5rem' }}
            >
              <MessageSquare size={16} />
              <span>{str('whatsAppConcierge')}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
