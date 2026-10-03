import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, X, Check } from 'lucide-react';
import { productsApi } from '../api/productsApi';
import { ProductCard } from '../components/shop/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { formatEGP } from '../utils/bilingual';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, str, t } = useLanguage();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const selectedCategory = searchParams.get('category') || '';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await productsApi.getCategories();
      setCategories(cats || []);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = {
        categoryId: selectedCategory || undefined,
        search: searchQuery || undefined,
        maxPrice: maxPrice || undefined,
        inStock: inStockOnly ? true : undefined,
        sortBy: sortBy !== 'featured' ? sortBy : undefined,
      };
      const data = await productsApi.getProducts(params);
      setProducts(data.items || []);
      setLoading(false);
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);

  const handleCategorySelect = (catSlugOrId) => {
    if (selectedCategory === catSlugOrId) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catSlugOrId);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setMaxPrice(50000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div style={{ backgroundColor: 'var(--surface-base)', minHeight: '80vh', padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-bronze-dark)', fontWeight: 600 }}>
            {language === 'ar' ? 'الكتالوج المعماري' : 'Architectural Archive'}
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.8rem)', marginTop: '0.4rem', color: 'var(--text-primary)' }}>
            {str('shop')}
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.92rem', marginTop: '0.5rem', maxWidth: '640px' }}>
            {language === 'ar' 
              ? 'تصفح تشكيلة ديزاين آند مور من ديكورات الصاج المقصوص بالليزر، ساعات التروس الميكانيكية، والقطع المعدنية المعمارية المتقنة وأكثر.' 
              : 'Explore curated editions uniting precision laser-cut sheet metal, mechanical gear clocks, and architectural metal decor & more.'}
          </p>
        </div>

        {/* Toolbar: Search, Sort, Mobile Filter Toggle */}
        <div 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '2rem' 
          }}
        >
          {/* Quick Search Field */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={str('searchPlaceholder')}
              style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
            />
            <Search size={16} color="var(--brand-bronze)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '12px', color: 'var(--text-tertiary)' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Right: Counter, Sort Dropdown & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
              {products.length} {language === 'ar' ? 'قطعة معمارية' : 'items'}
            </span>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: 'auto',
                minWidth: '180px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                backgroundColor: 'var(--surface-raised)',
              }}
            >
              <option value="featured">{language === 'ar' ? 'ترتيب المقترح' : 'Curated Order'}</option>
              <option value="price_asc">{language === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price_desc">{language === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              <option value="rating">{language === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
            </select>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="btn btn-secondary d-mobile-flex"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <SlidersHorizontal size={15} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* 12-Column Layout: Sidebar Filter (3 cols) + Grid (9 cols) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem' }}>
          {/* Desktop Filter Sidebar */}
          <aside 
            style={{ 
              gridColumn: 'span 3',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
            }}
            className="d-none-tablet"
          >
            {/* Filter by Category */}
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                {language === 'ar' ? 'التصنيف' : 'Category'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => handleCategorySelect('')}
                  style={{
                    textAlign: 'start',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: !selectedCategory ? 600 : 400,
                    backgroundColor: !selectedCategory ? 'var(--surface-container)' : 'transparent',
                    color: !selectedCategory ? 'var(--brand-bronze-dark)' : 'var(--text-secondary)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {language === 'ar' ? 'جميع التصنيفات' : 'All Collections'}
                </button>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      style={{
                        textAlign: 'start',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 600 : 400,
                        backgroundColor: isSelected ? 'var(--surface-container)' : 'transparent',
                        color: isSelected ? 'var(--brand-bronze-dark)' : 'var(--text-secondary)',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      {t(cat, 'name')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Max Price */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {language === 'ar' ? 'الحد الأقصى للسعر' : 'Max Price'}
                </h3>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-bronze-dark)' }}>
                  {formatEGP(maxPrice, language)}
                </span>
              </div>
              <input 
                type="range"
                min="500"
                max="50000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brand-bronze)' }}
              />
            </div>

            {/* In-Stock Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input 
                type="checkbox"
                id="inStockCheck"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--brand-bronze)' }}
              />
              <label htmlFor="inStockCheck" style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer' }}>
                {language === 'ar' ? 'المتوفر للشحن الفوري فقط' : 'Ready for Immediate Dispatch Only'}
              </label>
            </div>

            {/* Reset Filters */}
            <button 
              onClick={handleResetFilters}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.65rem 1rem' }}
            >
              {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
            </button>
          </aside>

          {/* Product Grid Area (9 cols on desktop, 12 on mobile) */}
          <main style={{ gridColumn: 'span 9' }} className="col-12-tablet">
            {loading ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                Filtering architectural pieces...
              </div>
            ) : products.length === 0 ? (
              <div 
                style={{ 
                  padding: '4rem 2rem', 
                  textAlign: 'center', 
                  backgroundColor: 'var(--surface-raised)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  No matching architectural items found
                </h3>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  Try adjusting your filters or price slider.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary">
                  {language === 'ar' ? 'عرض الكتالوج بالكامل' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '2rem' 
                }}
              >
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
