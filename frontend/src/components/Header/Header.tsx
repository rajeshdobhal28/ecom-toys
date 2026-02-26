'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, User, Package, LogOut, X, LogIn } from 'lucide-react';
import { useState, useRef, useEffect, useState as useReactState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { items, openCart } = useCart();
  const { user, loading, login, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevItemsCount = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
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
          <Link href="/shop/trending" className={styles.link}>
            Trending
          </Link>
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
          <button className={styles.mobileMenu} aria-label="Menu" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {mounted && isMobileMenuOpen && createPortal(
        <>
          <div className={styles.mobileOverlay} onClick={toggleMobileMenu}></div>
          <div className={styles.mobileDropdown}>
            <div className={styles.mobileHeader}>
              <button
                className={styles.mobileHeaderClose}
                onClick={toggleMobileMenu}
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
              <h3 className={styles.mobileGreeting}>
                {user ? `Hi, ${user.name.split(' ')[0]}!` : 'Welcome!'}
              </h3>
            </div>

            <div className={styles.mobileContent}>
              {user ? (
                <>
                  <Link href="/profile" className={styles.mobileLink} onClick={toggleMobileMenu}>
                    <User size={20} className={styles.mobileLinkIcon} />
                    My Profile
                  </Link>
                  <Link href="/orders" className={styles.mobileLink} onClick={toggleMobileMenu}>
                    <Package size={20} className={styles.mobileLinkIcon} />
                    My Orders
                  </Link>
                </>
              ) : (
                <button
                  className={styles.mobileLink}
                  style={{ background: 'white', color: 'var(--primary)', justifyContent: 'center', marginTop: '0.5rem', border: 'none' }}
                  onClick={() => { login(); toggleMobileMenu(); }}
                >
                  <LogIn size={20} />
                  Login to your account
                </button>
              )}
            </div>

            {user && (
              <div className={styles.mobileLogout}>
                <button
                  className={styles.mobileLink}
                  style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white', justifyContent: 'center' }}
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </>,
        document.body
      )}
    </header>
  );
}
