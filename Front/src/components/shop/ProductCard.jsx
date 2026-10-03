import { apiAssetUrl } from '../../config/api';
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatEGP } from '../../utils/bilingual';

export const ProductCard = ({ product }) => {
  const { language, str, t } = useLanguage();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const primaryImage = product.images?.[0]?.imageUrl || product.imageUrl;

  return (
    <div className="product-card">
      {/* 4:5 Aspect Ratio Image Wrapper */}
      <div className="product-card-img-wrap">
        <Link to={`/product/${product.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img 
            src={apiAssetUrl(primaryImage)} 
            alt={product.titleEn} 
            loading="lazy" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </Link>

        {/* Top Badges */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '12px', 
            left: '12px', 
            right: '12px', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none'
          }}
        >
          {product.isInStock ? (
            <span className="badge badge-bronze" style={{ pointerEvents: 'auto' }}>
              {language === 'ar' ? 'متوفر' : 'In Stock'}
            </span>
          ) : (
            <span className="badge badge-subtle" style={{ pointerEvents: 'auto' }}>
              {language === 'ar' ? 'طلب مخصص' : 'Custom Order'}
            </span>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            style={{
              pointerEvents: 'auto',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isFavorited ? 'var(--color-error)' : 'var(--text-secondary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all var(--transition-fast)'
            }}
            title="Add to Wishlist"
            aria-label="Add to Wishlist"
          >
            <Heart size={16} fill={isFavorited ? 'var(--color-error)' : 'none'} />
          </button>
        </div>

        {/* Quick Add Overlay on Hover */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            gap: '8px',
          }}
        >
          <button
            onClick={() => addItem(product, 1)}
            className="btn btn-primary"
            style={{
              flex: 1,
              padding: '0.6rem 0.8rem',
              fontSize: '0.8rem',
              boxShadow: 'var(--shadow-level-2)',
            }}
          >
            <ShoppingBag size={14} />
            <span>{str('addToCart')}</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Rating and Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem', fontSize: '0.78rem', color: 'var(--brand-bronze-dark)' }}>
          <Star size={13} fill="var(--brand-bronze)" color="var(--brand-bronze)" />
          <span style={{ fontWeight: 600 }}>{product.averageRating || 4.9}</span>
          <span style={{ color: 'var(--text-tertiary)' }}>({product.reviewsCount || 8})</span>
        </div>

        {/* Title */}
        <Link 
          to={`/product/${product.slug}`}
          style={{ 
            fontSize: '1.05rem', 
            fontWeight: 600, 
            lineHeight: 1.35, 
            marginBottom: '0.35rem',
            color: 'var(--text-primary)',
          }}
        >
          {t(product, 'title')}
        </Link>

        {/* Subtitle */}
        <p 
          style={{ 
            fontSize: '0.82rem', 
            color: 'var(--text-tertiary)', 
            marginBottom: '1rem',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {t(product, 'subtitle')}
        </p>

        {/* Price & Specs Link */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--brand-bronze-dark)' }}>
            {formatEGP(product.price, language)}
          </div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>
            {product.dimensions?.split('×')[0] || 'Sheet Metal Spec'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
