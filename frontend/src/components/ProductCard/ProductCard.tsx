'use client';

import { Star, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
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

// Helper to reliably map an ID string to a soft pastel category color
const getDeterministicColor = (id: string | number) => {
  const colors = ['#ffeaa7', '#74b9ff', '#ff7675', '#a29bfe', '#81ecec', '#fab1a0'];
  const num = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[num % colors.length];
};

export default function ProductCard({
  id,
  title,
  price,
  rating, // usually comes from average_rating on backend
  imageColor = '#fff',
  imageUrl,
  category = 'General',
  slug,
  quantity = 1, // default to 1 so it assumes available if not passed
  review_count = 0,
}: ProductCardProps) {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const isSoldOut = quantity === 0;

  const cartItem = items.find((item) => item.id === id);

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

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) updateQuantity(id, 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartItem) return;
    if (cartItem.quantity <= 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, -1);
    }
  };

  return (
    <Link href={`/product/${slug || title}`} className={styles.cardLink}>
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
          style={{
            backgroundColor: imageColor || getDeterministicColor(id),
            position: 'relative',
            background: `radial-gradient(circle, #ffffff 0%, ${imageColor || getDeterministicColor(id)} 100%)`
          }}
        >
          {isSoldOut && <div className={styles.soldOutBadge}>Sold Out</div>}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className={`${styles.productImage} ${isSoldOut ? styles.soldOutImage : ''}`}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
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
            {cartItem ? (
              <div className={styles.quantityControlsWrapper} onClick={e => e.preventDefault()}>
                <div className={styles.quantityControls}>
                  <button onClick={handleDecrement} aria-label="Decrease quantity">
                    <Minus size={14} />
                  </button>
                  <span>{cartItem.quantity}</span>
                  <button onClick={handleIncrement} aria-label="Increase quantity">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className={`${styles.addBtn} ${isSoldOut ? styles.disabledAddBtn : ''}`}
                aria-label={isSoldOut ? "Sold Out" : "Add to Cart"}
                onClick={handleAddToCart}
                disabled={isSoldOut}
              >
                <ShoppingCart size={18} />
                {isSoldOut ? "Sold Out" : "Add to Cart"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
