"use client";

import { Star, ShoppingCart, Heart } from 'lucide-react';
import styles from './ProductCard.module.css';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    id: string | number;
    title: string;
    price: number | string;
    rating?: number;
    imageColor?: string; // For placeholder
    imageUrl?: string;
    category?: string;
}

export default function ProductCard({ id, title, price, rating = 5, imageColor = '#FF6B6B', imageUrl, category = 'General' }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            id,
            title,
            price: Number(price), // Ensure price is number
            rating,
            category,
            color: imageColor,
            imageUrl, // Pass image URL to cart
            slug: '' // Slug not strictly needed for cart logic but part of Product interface
        });
    };

    return (
        <div className={styles.card}>
            <button className={styles.wishlistBtn} aria-label="Add to Wishlist">
                <Heart size={20} />
            </button>

            <div className={styles.imageContainer} style={{ backgroundColor: imageColor }}>
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className={styles.productImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div className={styles.placeholderIcon}>🧸</div>
                )}
            </div>

            <div className={styles.details}>
                <div className={styles.rating}>
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={i < rating ? styles.starFilled : styles.starEmpty}
                            fill={i < rating ? "currentColor" : "none"}
                        />
                    ))}
                    <span className={styles.reviewCount}>(42)</span>
                </div>

                <h3 className={styles.title}>{title}</h3>

                <div className={styles.footer}>
                    <span className={styles.price}>${Number(price).toFixed(2)}</span>
                    <button className={styles.addBtn} aria-label="Add to Cart" onClick={handleAddToCart}>
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
