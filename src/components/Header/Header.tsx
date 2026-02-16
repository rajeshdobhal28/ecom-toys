"use client";

import Link from 'next/link';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';

export default function Header() {
    const { items, openCart } = useCart();
    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <div className={styles.logo}>
                    <Link href="/">
                        <span className={styles.logoText}>Wonder<span className={styles.logoHighlight}>Toys</span></span>
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <Link href="/shop/educational" className={styles.link}>Educational</Link>
                    <Link href="/shop/outdoor" className={styles.link}>Outdoor</Link>
                    <Link href="/shop/plush" className={styles.link}>Soft Toys</Link>
                    <Link href="/shop/arts" className={styles.link}>Arts & Crafts</Link>
                </nav>

                <div className={styles.actions}>
                    <button className={styles.iconBtn} aria-label="Search">
                        <Search size={24} />
                    </button>
                    <button className={styles.cartBtn} aria-label="Cart" onClick={openCart}>
                        <ShoppingBag size={24} />
                        {items.length > 0 && <span className={styles.cartCount}>{items.length}</span>}
                    </button>
                    <button className={styles.mobileMenu} aria-label="Menu">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
}
