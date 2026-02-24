'use client';

import { Star, ShoppingCart, Heart } from 'lucide-react';
import styles from './ProductCard.module.css';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface ProductCardProps {
  id: string | number;
  title: string;
  price: number | string;
  rating?: number;
  imageColor?: string; // For placeholder
  imageUrl?: string;
  category?: string;
  slug?: string;
  quantity?: number;
  review_count?: number;
}

export default function ProductCard({
  id,
  title,
  price,
  rating, // usually comes from average_rating on backend
  imageColor = '#FF6B6B',
  imageUrl,
  category = 'General',
  slug,
  quantity = 1, // default to 1 so it assumes available if not passed
  review_count = 0,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const isSoldOut = quantity === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    e.stopPropagation();
    if (isSoldOut) return;

    addToCart({
      id,
      title,
      price: Number(price), // Ensure price is number
      rating: rating || 0,
      category,
      color: imageColor,
      imageUrl, // Pass image URL to cart
      slug: slug || '',
    });
  };

  return (
    <Link href={`/product/${title}`} className={styles.cardLink}>
      <div className={styles.card}>
        <button
          className={styles.wishlistBtn}
          aria-label="Add to Wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart size={20} />
        </button>

        <div
          className={styles.imageContainer}
          style={{ backgroundColor: '#f8f9fa', position: 'relative' }}
        >
          {isSoldOut && <div className={styles.soldOutBadge}>Sold Out</div>}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className={`${styles.productImage} ${isSoldOut ? styles.soldOutImage : ''}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className={styles.placeholderIcon}>🧸</div>
          )}
        </div>

        <div className={styles.details}>
          {rating ? (
            <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(Number(rating)) ? styles.starFilled : styles.starEmpty}
                  fill={i < Math.round(Number(rating)) ? 'currentColor' : 'none'}
                />
              ))}
              <span className={styles.reviewCount}>({review_count})</span>
            </div>
          ) : null}

          <h3 className={styles.title}>{title}</h3>

          <div className={styles.footer}>
            <span className={styles.price}>₹{Number(price).toFixed(2)}</span>
            <button
              className={`${styles.addBtn} ${isSoldOut ? styles.disabledAddBtn : ''}`}
              aria-label={isSoldOut ? "Sold Out" : "Add to Cart"}
              onClick={handleAddToCart}
              disabled={isSoldOut}
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
