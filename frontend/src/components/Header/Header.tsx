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
  const dropdownRef = useRef<HTMLDivElement>(null);

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
            <button
              className={styles.iconBtn}
              aria-label="Account"
              onClick={user ? toggleDropdown : login}
            >
              <User size={24} />
            </button>

            {isDropdownOpen && user && (
              <div className={styles.dropdown}>
                <div className={styles.userProfile}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userEmail}>{user.email}</span>
                </div>
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
            className={styles.cartBtn}
            aria-label="Cart"
            onClick={openCart}
          >
            <ShoppingBag size={24} />
            {items.length > 0 && (
              <span className={styles.cartCount}>{items.length}</span>
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
