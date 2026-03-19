import Link from "next/link";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <h3 className={styles.logo}>
            Wonder<span className={styles.highlight}>Toys</span>
          </h3>
          <p className={styles.tagline}>
            Bringing smiles to families with safe, educational, and fun toys
            since 2024.
          </p>
        </div>

        <div className={styles.column}>
          <h4 className={styles.heading}>Shop</h4>
          <Link href="/products" className={styles.link}>All Toys</Link>
          <Link href="/products" className={styles.link}>Educational</Link>
          <Link href="/products" className={styles.link}>Outdoor</Link>
          <Link href="/products" className={styles.link}>Soft Toys</Link>
        </div>

        <div className={styles.column}>
          <h4 className={styles.heading}>Support</h4>
          <Link href="/" className={styles.link}>Help Center</Link>
          <Link href="/" className={styles.link}>Shipping & Returns</Link>
          <Link href="/" className={styles.link}>Contact Us</Link>
          <Link href="/" className={styles.link}>Privacy Policy</Link>
        </div>

        <div className={styles.column}>
          <h4 className={styles.heading}>Stay Connected</h4>
          <p className={styles.newsletter}>
            Join our newsletter for exclusive offers!
          </p>
          <div className={styles.socials}>
            <span className={styles.socialIcon}>IG</span>
            <span className={styles.socialIcon}>FB</span>
            <span className={styles.socialIcon}>TW</span>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} WonderToys Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
