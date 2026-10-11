import { apiAssetUrl } from '../config/api';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  MessageSquare, 
  ShieldCheck, 
  Truck, 
  Check, 
  Clock, 
  Plus, 
  Minus,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { productsApi } from '../api/productsApi';
import { contactInfo } from '../config/contactInfo';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { formatEGP } from '../utils/bilingual';
import { ProductCard } from '../components/shop/ProductCard';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const { language, isRTL, str, t } = useLanguage();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Related products
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const prod = await productsApi.getProductBySlug(slug);
        setProduct(prod);

        if (prod?.id) {
          const revs = await productsApi.getProductReviews(prod.id);
          setReviews(revs || []);

          const rel = await productsApi.getProducts({ categoryId: prod.categoryId, pageSize: 3 });
          setRelated((rel.items || []).filter((p) => p.id !== prod.id).slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
        Loading architectural specifications...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Collections
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: 'img-def', imageUrl: product.imageUrl }];

  const activeImage = images[activeImageIndex]?.imageUrl || product.imageUrl;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);
    try {
      const newRev = await productsApi.submitReview(product.id, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviews((prev) => [newRev, ...prev]);
      setReviewComment('');
      setReviewSuccess(language === 'ar' ? 'شكراً لتقييمكم! تم إرسال التقييم بنجاح.' : 'Thank you! Your architectural review was submitted.');
      setTimeout(() => setReviewSuccess(''), 4000);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const whatsAppInquiryUrl = `https://wa.me/${contactInfo.communication.whatsApp.number.replace('+', '')}?text=${encodeURIComponent(
    `Hello Design & More team, I would like to inquire about "${product.titleEn}" (SKU: ${product.slug}).`
  )}`;

  return (
    <div style={{ backgroundColor: 'var(--surface-base)', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'inherit' }}>{str('home')}</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: 'inherit' }}>{str('shop')}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{t(product, 'title')}</span>
        </div>

        {/* 2-Column Product Detail Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '5rem' }}>
          {/* Gallery Left (7 cols) */}
          <div style={{ gridColumn: 'span 7' }} className="col-12-tablet">
            {/* Main Stage Image */}
            <div 
              style={{ 
                width: '100%', 
                aspectRatio: '4 / 4.5', 
                borderRadius: 'var(--radius-lg)', 
                overflow: 'hidden', 
                backgroundColor: 'var(--surface-container)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-level-1)',
                marginBottom: '1rem'
              }}
            >
              <img 
                src={apiAssetUrl(activeImage)} 
                alt={product.titleEn} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=85';
                }}
              />
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {images.map((img, i) => (
                  <button
                    key={img.id || i}
                    onClick={() => setActiveImageIndex(i)}
                    style={{
                      width: '80px',
                      height: '95px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: i === activeImageIndex ? '2px solid var(--brand-bronze)' : '1px solid var(--border-subtle)',
                      opacity: i === activeImageIndex ? 1 : 0.65,
                      padding: 0,
                      flexShrink: 0,
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <img 
                      src={apiAssetUrl(img.imageUrl)} 
                      alt="" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Specifications & Purchase Right (5 cols) */}
          <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column' }} className="col-12-tablet">
            {/* Title */}
            <h1 style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)', color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '0.5rem' }}>
              {t(product, 'title')}
            </h1>

            {/* Subtitle */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {t(product, 'subtitle')}
            </p>

            {/* Price */}
            <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--brand-bronze-dark)', marginBottom: '1.5rem' }}>
              {formatEGP(product.price, language)}
            </div>

            {/* Stock Availability Indicator */}
            <div style={{ marginBottom: '1.5rem' }}>
              {product.isInStock ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontSize: '0.88rem', fontWeight: 600 }}>
                  <Check size={18} />
                  <span>{str('inStock')} ({product.stockQuantity} remaining)</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-bronze)', fontSize: '0.88rem', fontWeight: 600 }}>
                  <Clock size={18} />
                  <span>{str('backorder')}</span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  border: '1px solid var(--border-strong)', 
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-raised)',
                  height: '46px'
                }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: '0 14px', height: '100%', color: 'var(--text-secondary)' }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 600, padding: '0 12px', minWidth: '32px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 10, q + 1))}
                  style={{ padding: '0 14px', height: '100%', color: 'var(--text-secondary)' }}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                onClick={() => addItem(product, quantity)}
                className="btn btn-primary"
                style={{ flex: 1, height: '46px', gap: '0.6rem', fontSize: '0.92rem' }}
              >
                <ShoppingBag size={18} />
                <span>{str('addToCart')}</span>
              </button>
            </div>

            {/* Inquire on WhatsApp */}
            <a
              href={whatsAppInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ width: '100%', gap: '0.6rem', height: '44px', marginBottom: '2rem', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}
            >
              <MessageSquare size={17} />
              <span>{language === 'ar' ? 'استفسار فوري عبر واتساب' : 'Inquire on WhatsApp with Curator'}</span>
            </a>

            {/* Guarantees & Shipping Assurance */}
            <div 
              style={{ 
                padding: '1.25rem', 
                backgroundColor: 'var(--surface-subtle)', 
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Truck size={17} color="var(--brand-bronze)" />
                <span>White-glove inside delivery available across all Egyptian Governorates.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={17} color="var(--brand-bronze)" />
                <span>Crafted under Atelier Nile Minimal structural tolerances and warranties.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Architectural Narrative */}
        <div 
          style={{ 
            backgroundColor: 'var(--surface-raised)', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-subtle)',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            marginBottom: '4rem',
            boxShadow: 'var(--shadow-level-1)'
          }}
        >
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            {str('specifications')}
          </h2>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '2rem', maxWidth: '820px' }}>
            {t(product, 'description')}
          </p>

          {/* Specs Table */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '1.5rem',
              padding: '1.5rem',
              backgroundColor: 'var(--surface-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                {str('dimensions')}
              </span>
              <div style={{ fontWeight: 600, marginTop: '4px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                {product.dimensions || 'Custom Specification'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                {str('weight')}
              </span>
              <div style={{ fontWeight: 600, marginTop: '4px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                {product.weight || 'Solid Core Spec'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                {str('finish')}
              </span>
              <div style={{ fontWeight: 600, marginTop: '4px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                {product.finish || 'Hand-finished Patina'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                {str('materials')}
              </span>
              <div style={{ fontWeight: 600, marginTop: '4px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                {product.materials?.join(', ') || (language === 'ar' ? 'صاج مقصوص بالليزر ودهان إلكتروستاتيك وأكثر' : 'Laser-Cut Sheet Metal & Electrostatic Coating & More')}
              </div>
            </div>
          </div>
        </div>

        {/* Client Reviews Section & Submission */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
              {str('customerReviews')} ({reviews.length})
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem' }}>
            {/* Reviews List (7 cols) */}
            <div style={{ gridColumn: 'span 7' }} className="col-12-tablet">
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                  No customer reviews yet. Be the first to share your architectural impressions.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {reviews.map((rev) => (
                    <div 
                      key={rev.id} 
                      style={{ 
                        padding: '1.5rem', 
                        backgroundColor: 'var(--surface-raised)', 
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                            {rev.userName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(rev.rating || 0)].map((_, i) => (
                            <Star key={i} size={13} fill="var(--brand-bronze)" color="var(--brand-bronze)" />
                          ))}
                        </div>
                      </div>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review Card (5 cols) */}
            <div style={{ gridColumn: 'span 5' }} className="col-12-tablet">
              <div 
                style={{ 
                  padding: '2rem', 
                  backgroundColor: 'var(--surface-subtle)', 
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {str('writeReview')}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: '1.25rem' }}>
                  Share your impressions on craftsmanship, finishing tolerances, and material depth.
                </p>

                {reviewSuccess && (
                  <div style={{ backgroundColor: 'rgba(45, 106, 79, 0.1)', color: 'var(--color-success)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                    {reviewSuccess}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Rating Selector */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                      Rating
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          style={{ padding: '4px' }}
                        >
                          <Star 
                            size={22} 
                            fill={star <= reviewRating ? 'var(--brand-bronze)' : 'none'} 
                            color="var(--brand-bronze)" 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                      Your Review
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={language === 'ar' ? 'اكتب تقييمك لجودة قص الليزر، تشطيب الصاج، الدقة، والتوصيل...' : 'Comment on laser cutting precision, sheet metal finish, packaging...'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.75rem' }}
                  >
                    {reviewSubmitting ? 'Submitting...' : str('submitReview')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Related Pieces */}
        {related.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '4rem' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>
              {language === 'ar' ? 'قطع تكميلية متناغمة' : 'Complementary Architectural Compositions'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
