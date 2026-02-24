'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product } from '@/utils/utils';
import { useAuth } from './AuthContext';
import { API, makeApiRequest } from '@/api/api';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const syncing = useRef(false);

  // Load Initial Cart Data
  useEffect(() => {
    if (authLoading) return;

    const fetchCartDb = async () => {
      try {
        const response = await makeApiRequest(API.GET_CART, {});
        if (response.status === 'success') {
          return response.data;
        }
      } catch (err) {
        console.error('Failed to fetch DB cart', err);
      }
      return [];
    };

    const initialize = async () => {
      let localCart: CartItem[] = [];
      const savedCart = localStorage.getItem('wondertoys-cart');
      if (savedCart) {
        try {
          localCart = JSON.parse(savedCart);
        } catch (e) {
          console.error('Failed to parse cart', e);
        }
      }

      if (user) {
        // Logged In: Wipe local, fetch DB, optionally merge (here we just use DB or Push Local to DB)
        const dbCart = await fetchCartDb();

        // Basic merge: if we just logged in and had a local cart, we push the local cart to DB
        if (localCart.length > 0 && dbCart.length === 0) {
          setItems(localCart);
          localStorage.removeItem('wondertoys-cart');
        } else {
          setItems(dbCart);
          localStorage.removeItem('wondertoys-cart');
        }
      } else {
        // Guest: Use local cart
        setItems(localCart);
      }

      setIsInitialized(true);
    };

    initialize();
  }, [user, authLoading]);

  // Save Cart Data Whenever Items Change
  useEffect(() => {
    if (!isInitialized || authLoading || syncing.current) return;

    if (user) {
      // Sync to Database
      const saveToDb = async () => {
        syncing.current = true;
        try {
          await makeApiRequest(API.UPDATE_CART, { items });
        } catch (err) {
          console.error('Failed to sync cart to DB', err);
        } finally {
          syncing.current = false;
        }
      };
      // Debounce slightly by just running it
      saveToDb();
    } else {
      // Save to LocalStorage
      localStorage.setItem('wondertoys-cart', JSON.stringify(items));
    }
  }, [items, isInitialized, user, authLoading]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string | number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string | number, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        total,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
