import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Hammer, Sparkles, Layers, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const CustomOrderBanner = () => {
  const { language, isRTL, str } = useLanguage();

  const capabilities = [
    {
      icon: <Compass size={20} color="var(--brand-bronze)" />,
      titleEn: 'CAD & Laser Translation',
      titleAr: 'تحويل المخططات لقص الليزر',
      descEn: 'Direct translation of architectural DWG, DXF, and 3D CAD files into laser-cut fabrication paths.',
      descAr: 'ترجمة مباشرة لملفات الأوتوكاد والـ DXF إلى مسارات قص دقيقة على ماكينات الفايبر ليزر.',
    },
    {
      icon: <Hammer size={20} color="var(--brand-bronze)" />,
      titleEn: 'Fiber Laser & CNC Bending',
      titleAr: 'قص الفايبر ليزر والثني الرقمي',
      descEn: 'High-precision cutting of sheet metal up to 6mm, CNC press brake forming, and seamless hidden welds.',
      descAr: 'قص دقيق لألواح الصاج والمعادن، ثني هيدروليكي رقمي، ولحام مخفي فائق النظافة.',
    },
    {
      icon: <Layers size={20} color="var(--brand-bronze)" />,
      titleEn: 'Electrostatic & Powder Finishes',
      titleAr: 'الدهان الحراري والتشطيبات المعمارية',
      descEn: 'Oven-baked architectural powder coating, weather-resistant protection, and fine textured patinas.',
      descAr: 'دهانات إلكتروستاتيك حرارية مقاومة للعوامل الجوية والصدأ، وتشطيبات راقية ناعمة وخشنة.',
    },
  ];

  return (
    <section className="section-py hairline-b" style={{ backgroundColor: 'var(--surface-base)' }}>
      <div className="container">
        <div 
          style={{ 
            backgroundColor: '#1E2320', 
            color: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(2.5rem, 5vw, 4.5rem)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-level-3)',
          }}
        >
          {/* Subtle architectural background grid line decoration */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '400px',
              height: '400px',
              backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(184, 151, 108, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
              <span 
                className="badge" 
                style={{ 
                  backgroundColor: 'rgba(184, 151, 108, 0.2)', 
                  color: 'var(--brand-bronze-light)',
                  border: '1px solid rgba(184, 151, 108, 0.35)',
                }}
              >
                <Sparkles size={12} />
                {language === 'ar' ? 'طلب مخصص وتصنيع بالليزر' : 'Custom Order & Laser Fabrication'}
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#FFFFFF', lineHeight: 1.2, marginBottom: '1.25rem', fontWeight: 400 }}>
              {language === 'ar' 
                ? 'تصنيع ديكورات الصاج والقص بالليزر حسب الطلب وأكثر' 
                : 'Custom Sheet Metal Decor & Laser Fabrication & More'}
            </h2>

            <p style={{ fontSize: '1rem', color: '#D9D1C5', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              {language === 'ar'
                ? 'من القواطع الجدارية المفرغة بالليزر واللوحات الفنية المعدنية، إلى ساعات التروس وسائر ديكورات الصاج، نحول أفكاركم ومخططاتكم إلى قطع معدنية متقنة بالكامل بمركز تصنيعنا بالعاشر من رمضان.'
                : 'From laser-cut decorative wall panels and architectural screens to mechanical gear clocks and custom sheet metal decor, our fabrication facility in 10th of Ramadan translates your vision into flawless metal reality.'}
            </p>

            {/* 3 Pillars */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: '1.75rem',
                marginBottom: '2.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(229, 223, 213, 0.15)',
              }}
            >
              {capabilities.map((cap, i) => (
                <div key={i}>
                  <div style={{ marginBottom: '0.6rem' }}>{cap.icon}</div>
                  <h4 style={{ fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '0.35rem', fontWeight: 600 }}>
                    {language === 'ar' ? cap.titleAr : cap.titleEn}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#A39E96', lineHeight: 1.5, margin: 0 }}>
                    {language === 'ar' ? cap.descAr : cap.descEn}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <Link 
                to="/custom-order" 
                className="btn btn-bronze" 
                style={{ padding: '0.85rem 2rem', fontSize: '0.92rem' }}
              >
                <span>{language === 'ar' ? 'اطلب تصنيعك المخصص الآن' : 'Request Custom Order'}</span>
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomOrderBanner;
