import { apiAssetUrl } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, Layers } from 'lucide-react';
import { productsApi } from '../../api/productsApi';
import { useLanguage } from '../../context/LanguageContext';

export const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language, isRTL, str, t } = useLanguage();

  useEffect(() => {
    const fetchCats = async () => {
      setLoading(true);
      try {
        const data = await productsApi.getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <section className="section-py hairline-b" style={{ backgroundColor: 'var(--surface-base)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-bronze-dark)', fontWeight: 600 }}>
              {language === 'ar' ? 'تصنيفات الصاج والمعادن' : 'Sheet Metal Typologies'}
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', marginTop: '0.4rem', color: 'var(--text-primary)' }}>
              {language === 'ar' ? 'مجموعات الديكور المتاحة' : 'Curated Metal Collections'}
            </h2>
          </div>

          <Link 
            to="/shop" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              color: 'var(--brand-bronze-dark)', 
              fontWeight: 600,
              fontSize: '0.9rem' 
            }}
          >
            <span>{str('allCategories')}</span>
            {isRTL ? <ArrowLeft size={16} /> : <ArrowUpRight size={16} />}
          </Link>
        </div>

        {/* Categories Grid from API */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '1.75rem' 
          }}
        >
          {categories.map((cat, idx) => (
            <Link
              key={cat.id || idx}
              to={`/shop?category=${cat.id || cat.slug}`}
              style={{
                position: 'relative',
                height: '340px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem',
                color: '#FFFFFF',
                boxShadow: 'var(--shadow-level-1)',
                textDecoration: 'none',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#1E2320',
              }}
              className="product-card"
            >
              {/* Category Background Image or Default Fallback */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                <img
                  src={apiAssetUrl(cat.imageUrl) || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'}
                  alt={cat.nameEn || 'Metal Decor'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform var(--transition-slow)',
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80';
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(22, 25, 23, 0.9) 0%, rgba(22, 25, 23, 0.4) 55%, rgba(22, 25, 23, 0.1) 100%)',
                  }}
                />
              </div>

              {/* Category Foreground Details */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span 
                  style={{ 
                    fontSize: '0.72rem', 
                    letterSpacing: '0.08em', 
                    textTransform: 'uppercase', 
                    color: 'var(--brand-bronze-light)',
                    fontWeight: 600,
                    marginBottom: '0.35rem',
                    display: 'block'
                  }}
                >
                  Sheet Metal Series
                </span>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 500, color: '#FFFFFF', marginBottom: '0.4rem', lineHeight: 1.25 }}>
                  {t(cat, 'name')}
                </h3>

                <div 
                  style={{ 
                    marginTop: '1rem', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    fontSize: '0.82rem',
                    color: 'var(--brand-bronze-light)',
                    fontWeight: 600
                  }}
                >
                  <span>{language === 'ar' ? 'استكشف التشكيلة' : 'View Collection'}</span>
                  {isRTL ? <ArrowLeft size={14} /> : <ArrowUpRight size={14} />}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
