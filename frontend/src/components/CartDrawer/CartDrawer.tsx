'use client';

import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API, makeApiRequest } from '@/api/api';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  } = useCart();

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    try {
      const products = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      // Assuming API and makeApiRequest are imported. We need them.
      // Oh right, I need to add those imports to CartDrawer.tsx.
      // Let me update the whole file to include imports.
      const response = await makeApiRequest(API.CREATE_ORDER, { products });
      if (response.status === 'success') {
        alert('Order placed successfully!');
        clearCart();
        closeCart();
      } else {
        alert(response.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeCart}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Your Cart ({items.length})</h2>
          <button
            onClick={closeCart}
            className={styles.closeBtn}
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <ShoppingBag size={48} className={styles.emptyIcon} />
              <p>Your cart is empty.</p>
              <button onClick={closeCart} className="btn btn-secondary">
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div
                  className={styles.imagePlaceholder}
                  style={{ backgroundColor: item.color }}
                >
                  <img src={item.imageUrl} alt={item.title} width={120} height={120} />
                </div>
                <div className={styles.itemDetails}>
                  <h3>{item.title}</h3>
                  <p className={styles.price}>₹{item.price}</p>
                  <div className={styles.controls}>
                    <div className={styles.quantity}>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={styles.removeBtn}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <span>Subtotal</span>
              <span className={styles.totalAmount}>₹{total.toFixed(2)}</span>
            </div>
            <p className={styles.shippingNote}>
              Shipping & taxes calculated at checkout
            </p>
            <button
              className={`${styles.checkoutBtn} btn btn-primary`}
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
