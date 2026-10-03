import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Sparkles, X, Megaphone, Eye } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { adsApi } from '../../api/adsApi';
import { apiAssetUrl } from '../../config/api';

export const HeroSlider = () => {
  const { language, isRTL, str, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [ads, setAds] = useState([]);
  const [isAdClosed, setIsAdClosed] = useState(() => {
    return sessionStorage.getItem('dm_ad_dismissed') === 'true';
  });
  const [current, setCurrent] = useState(0);

  // Default normal hero banner (Sheet Metal Decor & Laser Fabrication & More)
  const defaultSlide = {
    id: 'metal-decor-default',
    titleEn: 'Sheet Metal Decor & Laser Fabrication & More',
    titleAr: 'ديكورات وتشكيل الصاج والقص بالليزر وأكثر',
    subtitleEn: 'Custom laser-cut decorative panels, mechanical gear clocks, bespoke sheet metal wall art, and precision architectural joinery & more.',
    subtitleAr: 'أعمال الصاج المعماري، القواطع المفرغة بالليزر، ساعات التروس الميكانيكية، والتشكيلات المعدنية المخصصة بدقة هندسية وأكثر.',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=90',
    badgeEn: 'Sheet Metal Decor & More',
    badgeAr: 'ديكورات الصاج والقص بالليزر وأكثر',
    linkUrl: '/shop',
    isDefault: true,
  };

  // Mock sample ad for instant preview testing if backend ad list is empty
  const samplePreviewAd = {
    id: 'sample-ad-preview',
    titleEn: 'Promotional Campaign: Custom Laser-Cut Sheet Metal Decor & More',
    titleAr: 'حملة إعلانية: خصومات حصرية على ديكورات الصاج والقص بالليزر وأكثر',
    subtitleEn: 'Commission bespoke architectural screens, metal wall art & mechanical clocks with expedited fabrication.',
    subtitleAr: 'صمم ونفذ قواطعك المعمارية ولوحات الصاج المفرغة بالليزر وساعات التروس مع شحن لكافة المحافظات.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1800&q=90',
    badgeEn: 'Live Campaign Preview',
    badgeAr: 'معاينة الحملة الإعلانية',
    linkUrl: '/custom-order',
  };

  useEffect(() => {
    const loadAds = async () => {
      try {
        const data = await adsApi.getAdvertisements();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((ad) => {
            const img = apiAssetUrl(ad.imageUrl);
            return {
              ...ad,
              imageUrl: img || defaultSlide.imageUrl,
              badgeEn: 'Promotional Campaign',
              badgeAr: 'إعلان مميز',
              subtitleEn: ad.subtitleEn || 'Exclusive sheet metal decor & laser fabrication campaign — order yours today.',
              subtitleAr: ad.subtitleAr || 'عرض حصري على أعمال الصاج المقصوص بالليزر وديكورات المعادن المتقنة.',
            };
          });
          setAds(formatted);
        } else if (searchParams.get('previewAd') === '1' || searchParams.get('previewAd') === 'true') {
          // If URL param ?previewAd=1 is passed, preview sample ad
          setAds([samplePreviewAd]);
        } else {
          setAds([]);
        }
      } catch (err) {
        setAds([]);
      }
    };
    loadAds();
  }, [searchParams]);

  // Determine active slides: If ads exist and not closed, preview the ads; otherwise, return to normal default hero
  const hasActiveAds = ads.length > 0 && !isAdClosed;
  const activeSlides = hasActiveAds ? ads : [defaultSlide];

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [activeSlides]);

  const slide = activeSlides[current] || defaultSlide;

  const handleCloseAd = () => {
    setIsAdClosed(true);
    sessionStorage.setItem('dm_ad_dismissed', 'true');
    setCurrent(0);
  };

  const handleReopenAd = () => {
    setIsAdClosed(false);
    sessionStorage.removeItem('dm_ad_dismissed');
    setCurrent(0);
  };

  const handleTriggerDemoAd = () => {
    setAds([samplePreviewAd]);
    setIsAdClosed(false);
    sessionStorage.removeItem('dm_ad_dismissed');
    setCurrent(0);
  };

  return (
    <section 
      style={{ 
        position: 'relative', 
        height: '84vh', 
        minHeight: '560px', 
        maxHeight: '820px', 
        overflow: 'hidden',
        backgroundColor: '#161917',
        color: '#FFFFFF'
      }}
    >
      {/* Background Image with Dark Vignette Overlay */}
      {activeSlides.map((s, idx) => (
        <div
          key={s.id || idx}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: idx === current ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 7s ease',
            transform: idx === current ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <img
            src={s.imageUrl}
            alt={s.titleEn || 'Sheet Metal Decor'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultSlide.imageUrl;
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(22, 25, 23, 0.92) 0%, rgba(22, 25, 23, 0.45) 50%, rgba(22, 25, 23, 0.65) 100%)',
            }}
          />
        </div>
      ))}

      {/* Top Banner Control Toolbar */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '1.5rem', 
          [isRTL ? 'left' : 'right']: '2rem', 
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}
      >
        {/* If Active Ad is shown: Prominent Close button to return to normal */}
        {hasActiveAds && (
          <button
            onClick={handleCloseAd}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(22, 25, 23, 0.85)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 'var(--radius-full)',
              padding: '7px 16px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              transition: 'all var(--transition-fast)',
            }}
            title={language === 'ar' ? 'إغلاق الإعلان والعودة للواجهة الطبيعية' : 'Close Advertisement & Return to Normal'}
          >
            <span>{language === 'ar' ? 'إغلاق الإعلان' : 'Close Ad'}</span>
            <X size={15} />
          </button>
        )}

        {/* If ad is closed: Reopen button */}
        {ads.length > 0 && isAdClosed && (
          <button
            onClick={handleReopenAd}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(158, 125, 83, 0.85)',
              color: '#FFFFFF',
              border: '1px solid var(--brand-bronze-light)',
              borderRadius: 'var(--radius-full)',
              padding: '7px 16px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
            }}
          >
            <Megaphone size={14} />
            <span>{language === 'ar' ? 'مشاهدة الإعلان' : 'View Campaign'}</span>
          </button>
        )}

        {/* Development / Preview toggle if no backend ads exist yet */}
        {ads.length === 0 && (
          <button
            onClick={handleTriggerDemoAd}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-full)',
              padding: '5px 12px',
              fontSize: '0.72rem',
              backdropFilter: 'blur(6px)',
              cursor: 'pointer',
            }}
            title="Preview how an active backend advertisement looks in place"
          >
            <Eye size={12} />
            <span>{language === 'ar' ? 'معاينة تجريبية للإعلان' : 'Preview Ad Slot'}</span>
          </button>
        )}
      </div>

      {/* Slide Content Frame */}
      <div 
        className="container" 
        style={{ 
          position: 'relative', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          zIndex: 2,
          paddingTop: '2rem'
        }}
      >
        <div style={{ maxWidth: '840px' }} className="animate-fade-in">
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
            <span 
              className="badge" 
              style={{ 
                backgroundColor: hasActiveAds ? 'rgba(198, 125, 38, 0.25)' : 'rgba(184, 151, 108, 0.22)', 
                color: hasActiveAds ? '#FBBF24' : 'var(--brand-bronze-light)',
                border: hasActiveAds ? '1px solid rgba(251, 191, 36, 0.45)' : '1px solid rgba(184, 151, 108, 0.4)',
                padding: '6px 14px',
                fontSize: '0.78rem'
              }}
            >
              {hasActiveAds ? <Megaphone size={13} /> : <Sparkles size={13} />}
              {t(slide, 'badge') || (language === 'ar' ? 'ديكورات وتشكيل الصاج وأكثر' : 'Sheet Metal Decor & More')}
            </span>
          </div>

          {/* Headline */}
          <h1 
            style={{ 
              fontSize: 'clamp(2.3rem, 4.2vw, 4rem)', 
              color: '#FFFFFF', 
              lineHeight: 1.18, 
              marginBottom: '1.25rem',
              fontWeight: 400,
              textShadow: '0 2px 10px rgba(0,0,0,0.35)'
            }}
          >
            {t(slide, 'title')}
          </h1>

          {/* Subtitle */}
          <p 
            style={{ 
              fontSize: 'clamp(1rem, 1.3vw, 1.2rem)', 
              color: '#D2C4B7', 
              lineHeight: 1.6, 
              marginBottom: '2.25rem',
              maxWidth: '680px'
            }}
          >
            {t(slide, 'subtitle') || (hasActiveAds 
              ? (language === 'ar' ? 'عرض حصري على أعمال الصاج المقصوص بالليزر والتشكيلات المعدنية المخصصة وأكثر.' : 'Exclusive campaign on custom laser-cut sheet metal decor & precision fabrication & more.') 
              : '')}
          </p>

          {/* Dual CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <Link 
              to={slide.linkUrl || '/shop'} 
              className="btn btn-bronze" 
              style={{ padding: '0.9rem 2rem', fontSize: '0.95rem' }}
            >
              <span>{hasActiveAds ? (language === 'ar' ? 'استكشف العرض' : 'Explore Offer') : str('exploreCollection')}</span>
              {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </Link>

            <Link 
              to="/custom-order" 
              className="btn" 
              style={{ 
                padding: '0.9rem 1.8rem', 
                fontSize: '0.95rem',
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <span>{str('requestCustom')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Controls & Carousel Indicators (only if multiple slides) */}
      {activeSlides.length > 1 && (
        <div 
          className="container"
          style={{ 
            position: 'absolute', 
            bottom: '2.5rem', 
            left: 0, 
            right: 0, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            zIndex: 3
          }}
        >
          {/* Indicators */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                style={{
                  width: idx === current ? '36px' : '10px',
                  height: '4px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: idx === current ? 'var(--brand-bronze-light)' : 'rgba(255, 255, 255, 0.3)',
                  transition: 'all var(--transition-normal)',
                  padding: 0,
                }}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next / Prev Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
              aria-label="Previous Slide"
            >
              {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            <button
              onClick={() => setCurrent((prev) => (prev + 1) % activeSlides.length)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
              aria-label="Next Slide"
            >
              {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
