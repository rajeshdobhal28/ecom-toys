"use client";

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import styles from '../product.module.css';

export default function AddToCartButton({ product }: { product: any }) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <button className={styles.addToCartBtn} onClick={handleAddToCart}>
            <ShoppingCart size={24} />
            Add to Cart
        </button>
    );
}
