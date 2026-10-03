import React from 'react';
import { MapPin, Phone, Clock, ArrowUpRight, Compass, Hammer, Sparkles } from 'lucide-react';
import { contactInfo } from '../config/contactInfo';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage = () => {
  const { language, isRTL, str } = useLanguage();

  return (
    <div style={{ backgroundColor: 'var(--surface-base)', padding: '4rem 0 6rem' }}>
      <div className="container">
        {/* Editorial Story Header */}
        <div style={{ maxWidth: '820px', margin: '0 auto 4rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--brand-bronze-dark)', fontWeight: 600 }}>
            {language === 'ar' ? 'عن الاستوديو والأتيليه' : 'Atelier Philosophy & Heritage'}
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '1.5rem', fontWeight: 400 }}>
            {str('brandStoryTitle')}
          </h1>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            {language === 'ar' ? contactInfo.brand.descriptionAr : contactInfo.brand.descriptionEn}
          </p>
        </div>

        {/* Cinematic Imagery Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(12, 1fr)', 
            gap: '1.5rem', 
            marginBottom: '5rem',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden'
          }}
        >
          <div style={{ gridColumn: 'span 8', height: '420px' }} className="col-12-tablet">
            <img 
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" 
              alt="Sheet Metal Decor" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div style={{ gridColumn: 'span 4', height: '420px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="col-12-tablet">
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <img 
                src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=85" 
                alt="Mechanical gears" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=85" 
                alt="Bronze metalwork" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          </div>
        </div>

        {/* 3 Craft Values */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2.5rem',
            marginBottom: '5rem',
            padding: '3rem',
            backgroundColor: 'var(--surface-raised)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-level-1)'
          }}
        >
          <div>
            <Compass size={28} color="var(--brand-bronze)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
              {language === 'ar' ? 'الدقة الهندسية التكتونية' : 'Tectonic Precision'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
              {language === 'ar' 
                ? 'كل قطعة تخضع لمخططات دقيقة وحسابات إنشائية لضمان تكامل ألواح الصاج والمعادن دون أدنى خطأ.'
                : 'Every millimeter of sheet metal is engineered with structural discipline. Tolerances mirror laser-cut architecture and mechanical joinery.'}
            </p>
          </div>

          <div>
            <Hammer size={28} color="var(--brand-bronze)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
              {language === 'ar' ? 'التشطيب اليدوي الأصيل' : 'Artisanal Chemistry'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
              {language === 'ar' 
                ? 'معالجة البرونز والنحاس يدوياً لإنتاج طبقات تعتيق فريدة تكتسب عمقاً وتألقاً بمرور السنين.'
                : 'Proprietary chemical patination baths and museum-grade waxes produce layered, living finishes that mature with grace.'}
            </p>
          </div>

          <div>
            <Sparkles size={28} color="var(--brand-bronze)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
              {language === 'ar' ? 'الفخامة الهادئة' : 'Quiet Luxury'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
              {language === 'ar' 
                ? 'تصاميم تستمد هيبتها من دقة تشكيل المعادن ونقاء الخطوط دون مبالغات استعراضية، لتمنح المكان هدوءاً وسكينة.'
                : 'Unhurried negative space, authentic architectural metals, and editorial proportions that anchor spaces with serene gravitas.'}
            </p>
          </div>
        </div>

        {/* Showrooms & Workshop Locations Section */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-bronze-dark)', fontWeight: 600 }}>
              Showroom & Production Presence
            </span>
            <h2 style={{ fontSize: '2rem', marginTop: '0.4rem', color: 'var(--text-primary)' }}>
              {str('showrooms')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {contactInfo.locations.map((loc) => (
              <div 
                key={loc.id}
                style={{ 
                  backgroundColor: 'var(--surface-raised)', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid var(--border-subtle)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-level-1)'
                }}
              >
                <div>
                  {loc.isPrimary && (
                    <span className="badge badge-bronze" style={{ marginBottom: '0.75rem' }}>
                      Flagship Experience
                    </span>
                  )}
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    {language === 'ar' ? loc.titleAr : loc.titleEn}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <MapPin size={16} color="var(--brand-bronze)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{language === 'ar' ? loc.addressAr : loc.addressEn}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={16} color="var(--brand-bronze)" style={{ flexShrink: 0 }} />
                      <span>{loc.phone}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} color="var(--brand-bronze)" style={{ flexShrink: 0 }} />
                      <span>{language === 'ar' ? loc.workingHoursAr : loc.workingHoursEn}</span>
                    </div>
                  </div>
                </div>

                <a 
                  href={loc.googleMapsUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ gap: '0.4rem', width: '100%', fontSize: '0.85rem' }}
                >
                  <span>{str('getDirections')}</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
