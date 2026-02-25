'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import styles from '../product.module.css';

export default function AddToCartButton({ product }: { product: any }) {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const isSoldOut = product.quantity === 0;

  const cartItem = items.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!isSoldOut) addToCart(product);
  };

  if (cartItem) {
    return (
      <div className={styles.quantityControls}>
        <button
          className={styles.quantityControlBtn}
          onClick={() => cartItem.quantity === 1 ? removeFromCart(cartItem.id) : updateQuantity(cartItem.id, -1)}
          aria-label="Decrease quantity"
        >
          {cartItem.quantity === 1 ? <Trash2 size={18} /> : <Minus size={20} />}
        </button>
        <span className={styles.quantityDisplay}>{cartItem.quantity}</span>
        <button
          className={styles.quantityControlBtn}
          onClick={() => updateQuantity(cartItem.id, 1)}
          aria-label="Increase quantity"
        >
          <Plus size={20} />
        </button>
      </div>
    );
  }

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
