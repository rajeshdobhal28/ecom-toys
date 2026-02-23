'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import styles from '../product.module.css';

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const isSoldOut = product.quantity === 0;

  const handleAddToCart = () => {
    if (!isSoldOut) addToCart(product);
  };

  return (
    <button
      className={isSoldOut ? styles.addToCartBtnDisabled : styles.addToCartBtn}
      onClick={handleAddToCart}
      disabled={isSoldOut}
    >
      <ShoppingCart size={24} />
      {isSoldOut ? "Sold Out" : "Add to Cart"}
    </button>
  );
}
