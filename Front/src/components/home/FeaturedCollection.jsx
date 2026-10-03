import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { productsApi } from '../../api/productsApi';
import { ProductCard } from '../shop/ProductCard';
import { useLanguage } from '../../context/LanguageContext';

export const FeaturedCollection = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const { language, isRTL, str, t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodData, catData] = await Promise.all([
          productsApi.getProducts({ pageSize: 12 }),
          productsApi.getCategories(),
        ]);
        setProducts(prodData.items || []);
        setCategories(catData || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = activeTab === 'all' 
    ? products 
    : products.filter((p) => p.categoryId === activeTab);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="section-py hairline-b" style={{ backgroundColor: 'var(--surface-subtle)' }}>
      <div className="container">
        {/* Header with Title & Filter Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-bronze-dark)', fontWeight: 600 }}>
                {language === 'ar' ? 'تشكيلات الصاج والمعادن' : 'Metal Decor Pieces'}
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', marginTop: '0.4rem', color: 'var(--text-primary)' }}>
                {language === 'ar' ? 'أحدث المقتنيات من الأتيليه' : 'Current Atelier Releases'}
              </h2>
            </div>

            <Link 
              to="/shop" 
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.65rem 1.4rem' }}
            >
              <span>{language === 'ar' ? 'عرض الكتالوج بالكامل' : 'Explore Catalog'}</span>
              {isRTL ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
            </Link>
          </div>

          {/* Dynamic Category Tabs based on real categories from API */}
          {categories.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  transition: 'all var(--transition-fast)',
                  backgroundColor: activeTab === 'all' ? 'var(--text-primary)' : 'var(--surface-raised)',
                  color: activeTab === 'all' ? 'var(--surface-base)' : 'var(--text-secondary)',
                  border: activeTab === 'all' ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                }}
              >
                {language === 'ar' ? 'جميع القطع' : 'All Pieces'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    transition: 'all var(--transition-fast)',
                    backgroundColor: activeTab === cat.id ? 'var(--text-primary)' : 'var(--surface-raised)',
                    color: activeTab === cat.id ? 'var(--surface-base)' : 'var(--text-secondary)',
                    border: activeTab === cat.id ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                  }}
                >
                  {t(cat, 'name')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Cards Grid from API */}
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            Loading catalog pieces...
          </div>
        ) : (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '2rem' 
            }}
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollection;
