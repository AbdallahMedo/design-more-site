import { apiAssetUrl } from '../../config/api';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { productsApi } from '../../api/productsApi';
import { useLanguage } from '../../context/LanguageContext';
import { formatEGP } from '../../utils/bilingual';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { language, isRTL, str, t } = useLanguage();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await productsApi.getProducts({ search: query, pageSize: 6 });
        setResults(data.items || []);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', justifyContent: 'center' }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(31, 36, 33, 0.55)',
          backdropFilter: 'blur(5px)',
        }}
      />

      {/* Modal Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          margin: '4rem 1.5rem auto',
          backgroundColor: 'var(--surface-raised)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-level-4)',
          overflow: 'hidden',
          zIndex: 1101,
          animation: 'fadeIn 0.2s ease',
        }}
      >
        {/* Search Header */}
        <div 
          className="hairline-b" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '1rem 1.5rem', 
            gap: '0.75rem',
            backgroundColor: 'var(--surface-base)'
          }}
        >
          <Search size={22} color="var(--brand-bronze)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={str('searchPlaceholder')}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '1.05rem',
              padding: '6px 0',
              boxShadow: 'none',
            }}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              style={{ color: 'var(--text-tertiary)', padding: '4px' }}
              aria-label="Clear query"
            >
              <X size={16} />
            </button>
          )}
          <button 
            onClick={onClose}
            style={{ 
              color: 'var(--text-primary)', 
              fontSize: '0.85rem',
              padding: '4px 8px',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {loading && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              Searching architectural archives...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No pieces found matching "{query}".
            </div>
          )}

          {!loading && results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    navigate(`/product/${product.slug}`);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'background-color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-subtle)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <img
                    src={apiAssetUrl(product.images?.[0]?.imageUrl || product.imageUrl)}
                    alt={product.titleEn}
                    style={{
                      width: '48px',
                      height: '56px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {t(product, 'title')}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                      {t(product, 'subtitle')}
                    </div>
                  </div>
                  <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                    <span style={{ fontWeight: 600, color: 'var(--brand-bronze-dark)', fontSize: '0.92rem' }}>
                      {formatEGP(product.price, language)}
                    </span>
                  </div>
                  {isRTL ? <ArrowLeft size={16} color="var(--brand-bronze)" /> : <ArrowRight size={16} color="var(--brand-bronze)" />}
                </div>
              ))}
            </div>
          )}

          {!query && (
            <div style={{ padding: '1rem 0' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                {language === 'ar' ? 'عمليات البحث الشائعة' : 'Popular Inquiries'}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                {['Metal Gear Clock', 'Mechanical Decor', 'Sheet Metal', 'Laser Cut'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    style={{
                      backgroundColor: 'var(--surface-container)',
                      color: 'var(--text-primary)',
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
