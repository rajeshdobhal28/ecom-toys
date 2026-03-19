"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import { HIGH_LEVEL_CATEGORIES } from "@/utils/constant";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.container}`}>
        <div className={styles.logo}>
          <Link href="/">
            Wonder<span className={styles.logoHighlight}>Toys</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          {HIGH_LEVEL_CATEGORIES.map((category) => (
            <Link key={category.slug} href={`/products?category=${category.slug}`} className={styles.navLink}>
              {category.name}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <button className={styles.cartBtn} aria-label="Cart">
            <ShoppingBag size={22} />
            <span className={styles.cartBadge}>0</span>
          </button>
          <button
            className={styles.menuBtn}
            aria-label="Menu"
            onClick={toggleMobileMenu}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={toggleMobileMenu}>
          <nav
            className={styles.mobileNav}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.mobileHeader}>
              <span className={styles.mobileLogo}>
                Wonder<span className={styles.logoHighlight}>Toys</span>
              </span>
              <button
                className={styles.closeBtn}
                onClick={toggleMobileMenu}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <Link
              href="/"
              className={styles.mobileLink}
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={styles.mobileLink}
              onClick={toggleMobileMenu}
            >
              Products
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
