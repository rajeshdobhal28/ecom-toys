'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { items, openCart } = useCart();
  const { user, loading, login, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevItemsCount = useRef(0);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Animate cart on item add
  useEffect(() => {
    if (totalQuantity > prevItemsCount.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
    prevItemsCount.current = totalQuantity;
  }, [totalQuantity]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <div className={styles.logo}>
          <Link href="/">
            <span className={styles.logoText}>
              Wonder<span className={styles.logoHighlight}>Toys</span>
            </span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link href="/shop/educational" className={styles.link}>
            Educational
          </Link>
          <Link href="/shop/outdoor" className={styles.link}>
            Outdoor
          </Link>
          <Link href="/shop/softtoys" className={styles.link}>
            Soft Toys
          </Link>
          <Link href="/shop/arts" className={styles.link}>
            Arts & Crafts
          </Link>
          <Link href="/contact" className={styles.link}>
            Contact Us
          </Link>
        </nav>

        <div className={styles.actions}>
          {/* <button className={styles.iconBtn} aria-label="Search">
                        <Search size={24} />
                    </button> */}

          <div className={styles.userContainer} ref={dropdownRef}>
            {user ? (
              <button
                className={styles.iconBtn}
                aria-label="Account"
                onClick={toggleDropdown}
              >
                <User size={24} />
              </button>
            ) : (
              <button
                className={`btn btn-primary ${styles.loginBtn}`}
                onClick={login}
              >
                Login
              </button>
            )}

            {isDropdownOpen && user && (
              <div className={styles.dropdown}>
                <div className={styles.userProfile}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userEmail}>{user.email}</span>
                </div>
                <Link
                  href="/profile"
                  className={styles.dropdownLink}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/orders"
                  className={styles.dropdownLink}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Orders
                </Link>
                <button className={styles.dropdownLink} onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <button
            className={`${styles.cartBtn} ${isAnimating ? styles.bump : ''}`}
            aria-label="Cart"
            onClick={openCart}
          >
            <ShoppingBag size={24} />
            {totalQuantity > 0 && (
              <span className={styles.cartCount}>{totalQuantity}</span>
            )}
          </button>
          <button className={styles.mobileMenu} aria-label="Menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
