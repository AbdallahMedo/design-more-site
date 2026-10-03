import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Cpu, Flame, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const CustomOrderSteps = () => {
  const { language, isRTL, str } = useLanguage();

  const steps = [
    {
      num: '01',
      icon: <FileUp size={28} color="var(--brand-bronze)" />,
      titleEn: '1. Share Your Idea or Sketch',
      titleAr: '١. أرسل فكرتك أو تصميمك',
      descEn: 'Upload an image, hand sketch, Pinterest concept, or CAD file with your desired dimensions.',
      descAr: 'ارفع صورة، رسم يدوي، صورة من بنترست، أو ملف أوتوكاد مع تحديد المقاسات التقريبية.',
    },
    {
      num: '02',
      icon: <Cpu size={28} color="var(--brand-bronze)" />,
      titleEn: '2. CAD & Laser Path Simulation',
      titleAr: '٢. التصميم الهندسي والمحاكاة',
      descEn: 'Our engineering team converts your concept into exact laser cutting vectors and structural joints.',
      descAr: 'يقوم مهندسو التصميم بإعداد مسارات القص الدقيقة ومعاينة القطعة هندسياً للتأكد من متانتها.',
    },
    {
      num: '03',
      icon: <Flame size={28} color="var(--brand-bronze)" />,
      titleEn: '3. Fiber Laser Cutting & Forming',
      titleAr: '٣. القص بالفايبر ليزر والثني',
      descEn: 'Fabricated using advanced fiber lasers with sub-millimeter tolerances, deburring, and seamless welds.',
      descAr: 'قص دقيق بأحدث ماكينات الفايبر ليزر، ثني آلي هيدروليكي، وتشطيب حواف ناعم ومتقن.',
    },
    {
      num: '04',
      icon: <Truck size={28} color="var(--brand-bronze)" />,
      titleEn: '4. Powder Coating & Delivery',
      titleAr: '٤. الدهان الحراري والتوصيل',
      descEn: 'Oven-baked electrostatic powder coating for rustproof durability, securely crated and delivered to your door.',
      descAr: 'دهان إلكتروستاتيك حراري مقاوم للصدأ والخدش بألوان متعددة وتوصيل مباشر لباب منزلك.',
    },
  ];

  return (
    <section className="section-py hairline-b" style={{ backgroundColor: 'var(--surface-base)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--brand-bronze-dark)', fontWeight: 600 }}>
            {language === 'ar' ? 'كيف تبدأ طلبك المخصص' : 'Custom Metal Fabrication Process'}
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', marginTop: '0.4rem', color: 'var(--text-primary)' }}>
            {language === 'ar' ? 'خطوات تصنيع وتنفيذ فكرتك المعدنية' : 'How Your Custom Order Comes to Life'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.6rem' }}>
            {language === 'ar'
              ? 'نحول أي فكرة أو رسمة أو لوحة جدارية إلى قطعة ديكور معدنية من الصاج المقصوص بالليزر والتشطيب الفاخر.'
              : 'From digital sketches to architectural metal centerpieces, our step-by-step process delivers tailored perfection.'}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem'
          }}
        >
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                backgroundColor: 'var(--surface-raised)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                padding: '2rem 1.5rem',
                boxShadow: 'var(--shadow-level-1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* Step Number Watermark */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '1.25rem', 
                  [isRTL ? 'left' : 'right']: '1.25rem', 
                  fontSize: '1.8rem', 
                  fontWeight: 800, 
                  color: 'var(--surface-container)',
                  lineHeight: 1
                }}
              >
                {step.num}
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                {step.icon}
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                {language === 'ar' ? step.titleAr : step.titleEn}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {language === 'ar' ? step.descAr : step.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/custom-order"
            className="btn btn-primary"
            style={{ padding: '0.9rem 2.5rem', fontSize: '0.95rem', gap: '0.6rem' }}
          >
            <span>{language === 'ar' ? 'ابدأ طلبك المخصص الآن' : 'Start Your Custom Order'}</span>
            {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CustomOrderSteps;
