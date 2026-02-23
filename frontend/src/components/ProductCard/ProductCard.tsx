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
}

export default function ProductCard({
  id,
  title,
  price,
  rating = 5,
  imageColor = '#FF6B6B',
  imageUrl,
  category = 'General',
  slug,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    e.stopPropagation();
    addToCart({
      id,
      title,
      price: Number(price), // Ensure price is number
      rating,
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
          style={{ backgroundColor: '#f8f9fa' }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className={styles.productImage}
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
                  className={i < rating ? styles.starFilled : styles.starEmpty}
                  fill={i < rating ? 'currentColor' : 'none'}
                />
              ))}
              <span className={styles.reviewCount}>(42)</span>
            </div>
          ) : null}

          <h3 className={styles.title}>{title}</h3>

          <div className={styles.footer}>
            <span className={styles.price}>₹{Number(price).toFixed(2)}</span>
            <button
              className={styles.addBtn}
              aria-label="Add to Cart"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
