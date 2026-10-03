import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { productsApi } from '../../api/productsApi';
import { useLanguage } from '../../context/LanguageContext';

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const { language, str } = useLanguage();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const prodData = await productsApi.getProducts({ pageSize: 5 });
        const items = prodData?.items || [];
        if (items.length > 0 && items[0].id) {
          const revs = await productsApi.getProductReviews(items[0].id);
          setReviews(Array.isArray(revs) ? revs : []);
        }
      } catch (e) {
        setReviews([]);
      }
    };
    fetchReviews();
  }, []);

  // If the backend has no reviews, do not render fabricated dummy data!
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="section-py hairline-b" style={{ backgroundColor: 'var(--surface-subtle)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-bronze-dark)', fontWeight: 600 }}>
            {str('customerReviews')}
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', marginTop: '0.4rem', color: 'var(--text-primary)' }}>
            {language === 'ar' ? 'تقييمات العملاء والمهندسين' : 'Client & Architect Reviews'}
          </h2>
        </div>

        {/* Real Reviews from API */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}
        >
          {reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                backgroundColor: 'var(--surface-raised)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-level-1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <Quote size={28} color="var(--brand-bronze)" style={{ opacity: 0.6 }} />
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} fill="var(--brand-bronze)" color="var(--brand-bronze)" />
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {rev.userName || 'Client'}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', margin: 0 }}>
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
