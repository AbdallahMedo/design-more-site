import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';
import { contactInfo } from '../../config/contactInfo';
import { useLanguage } from '../../context/LanguageContext';
import { productsApi } from '../../api/productsApi';

export const Footer = () => {
  const { language, str, t } = useLanguage();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productsApi.getCategories().then((data) => {
      setCategories(Array.isArray(data) ? data : []);
    });
  }, []);

  return (
    <footer 
      style={{ 
        backgroundColor: '#161917', 
        color: '#E5DFD5',
        borderTop: '1px solid #2C302E',
        paddingTop: '4.5rem',
        paddingBottom: '2.5rem'
      }}
    >
      <div className="container">
        {/* Main Footer Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '3rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid rgba(229, 223, 213, 0.12)'
          }}
        >
          {/* Column 1: Brand & Philosophy */}
          <div>
            <Link
              to="/"
              style={{
                display: 'inline-block',
                marginBottom: '1.25rem',
                padding: '0.75rem',
                backgroundColor: '#FBF9F5',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <img 
                src={`${import.meta.env.BASE_URL}logo/logo-hq.png`} 
                alt="Design & More" 
                style={{ height: 'auto', width: '240px', maxWidth: '100%', objectFit: 'contain', display: 'block' }}
              />
            </Link>
            
            <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: '#B8B3AB', marginBottom: '1.25rem' }}>
              {language === 'ar' ? contactInfo.brand.descriptionAr : contactInfo.brand.descriptionEn}
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', marginTop: '1.5rem' }}>
              <a 
                href={contactInfo.socialMedia.instagram.url} 
                target="_blank" 
                rel="noreferrer" 
                style={{ 
                  color: '#E5DFD5', 
                  backgroundColor: 'rgba(255,255,255,0.06)', 
                  padding: '9px', 
                  borderRadius: 'var(--radius-sm)' 
                }}
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href={contactInfo.socialMedia.facebook.url} 
                target="_blank" 
                rel="noreferrer" 
                style={{ 
                  color: '#E5DFD5', 
                  backgroundColor: 'rgba(255,255,255,0.06)', 
                  padding: '9px', 
                  borderRadius: 'var(--radius-sm)' 
                }}
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href={contactInfo.socialMedia.linkedin.url} 
                target="_blank" 
                rel="noreferrer" 
                style={{ 
                  color: '#E5DFD5', 
                  backgroundColor: 'rgba(255,255,255,0.06)', 
                  padding: '9px', 
                  borderRadius: 'var(--radius-sm)' 
                }}
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Architectural Collections */}
          <div>
            <h4 
              style={{ 
                color: '#FFFFFF', 
                fontSize: '1.05rem', 
                fontWeight: 500, 
                marginBottom: '1.25rem',
                letterSpacing: '0.04em'
              }}
            >
              {str('shop')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.88rem' }}>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/shop?category=${cat.id || cat.slug}`} style={{ color: '#B8B3AB' }}>
                    {t(cat, 'name')}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/custom-order" style={{ color: 'var(--brand-bronze-light)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {str('customOrder')} <ArrowUpRight size={14} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Showrooms & Visiting Hours */}
          <div>
            <h4 
              style={{ 
                color: '#FFFFFF', 
                fontSize: '1.05rem', 
                fontWeight: 500, 
                marginBottom: '1.25rem',
                letterSpacing: '0.04em'
              }}
            >
              {str('showrooms')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.85rem' }}>
              {contactInfo.locations.slice(0, 2).map((loc) => (
                <div key={loc.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }}>
                    {language === 'ar' ? loc.titleAr : loc.titleEn}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: '#B8B3AB' }}>
                    <MapPin size={15} style={{ flexShrink: 0, marginTop: '3px' }} color="var(--brand-bronze-light)" />
                    <span>{language === 'ar' ? loc.addressAr : loc.addressEn}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#8F8A83', fontSize: '0.8rem' }}>
                    <Clock size={13} style={{ flexShrink: 0 }} />
                    <span>{language === 'ar' ? loc.workingHoursAr : loc.workingHoursEn}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Direct Client Concierge */}
          <div>
            <h4 
              style={{ 
                color: '#FFFFFF', 
                fontSize: '1.05rem', 
                fontWeight: 500, 
                marginBottom: '1.25rem',
                letterSpacing: '0.04em'
              }}
            >
              {str('contact')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
              <a 
                href={`tel:${contactInfo.communication.primaryPhone}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#B8B3AB' }}
              >
                <Phone size={16} color="var(--brand-bronze-light)" />
                <span>{contactInfo.communication.primaryPhone}</span>
              </a>

              <a 
                href={`mailto:${contactInfo.communication.emails.info}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#B8B3AB' }}
              >
                <Mail size={16} color="var(--brand-bronze-light)" />
                <span>{contactInfo.communication.emails.info}</span>
              </a>

              <div style={{ marginTop: '0.5rem' }}>
                <a 
                  href={contactInfo.communication.whatsApp.directLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-bronze"
                  style={{ width: '100%', gap: '0.5rem', padding: '0.65rem 1rem', fontSize: '0.82rem' }}
                >
                  <MessageSquare size={16} />
                  <span>{str('whatsAppConcierge')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingTop: '2rem', 
            gap: '1rem',
            fontSize: '0.82rem',
            color: '#8F8A83'
          }}
        >
          <div>
            © {new Date().getFullYear()} {language === 'ar' ? contactInfo.brand.nameAr : contactInfo.brand.nameEn}. 
            {' '}{language === 'ar' ? contactInfo.brand.taglineAr : contactInfo.brand.taglineEn}. All rights reserved.
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/about" style={{ color: 'inherit' }}>{str('about')}</Link>
            <Link to="/shop" style={{ color: 'inherit' }}>{str('shop')}</Link>
            <Link to="/custom-order" style={{ color: 'inherit' }}>{str('customOrder')}</Link>
            <Link to="/contact" style={{ color: 'inherit' }}>{str('contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
