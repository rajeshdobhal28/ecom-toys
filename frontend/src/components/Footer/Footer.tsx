import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.column}>
          <h3 className={styles.logo}>
            Wonder<span className={styles.highlight}>Toys</span>
          </h3>
          <p className={styles.text}>
            Bringing smiles to families with safe, educational, and fun toys
            since 2024.
          </p>
        </div>

        <div className={styles.column}>
          <h4 className={styles.heading}>Shop</h4>
          <Link href="/shop/educational" className={styles.link}>
            Educational
          </Link>
          <Link href="/shop/outdoor" className={styles.link}>
            Outdoor
          </Link>
          <Link href="/shop/softtoys" className={styles.link}>
            Plush Toys
          </Link>
          <Link href="/shop" className={styles.link}>
            All Toys
          </Link>
        </div>

        <div className={styles.column}>
          <h4 className={styles.heading}>Support</h4>
          <Link href="/help" className={styles.link}>
            Help Center
          </Link>
          <Link href="/return-policy" className={styles.link}>
            Shipping & Returns
          </Link>
          <Link href="/contact" className={styles.link}>
            Contact Us
          </Link>
          <Link href="/privacy" className={styles.link}>
            Privacy Policy
          </Link>
          <Link href="/terms" className={styles.link}>
            Terms of Service
          </Link>
        </div>

        <div className={styles.column}>
          <h4 className={styles.heading}>Stay Connected</h4>
          <p className={styles.text}>
            Join our newsletter for exclusive offers!
          </p>
          <div className={styles.socials}>
            {/* Social icons would go here */}
            <div className={styles.socialIcon}>IG</div>
            <div className={styles.socialIcon}>FB</div>
            <div className={styles.socialIcon}>TW</div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div
          className="container"
          style={{ textAlign: 'center', fontSize: '0.9rem', color: '#B2BEC3' }}
        >
          &copy; {new Date().getFullYear()} WonderToys Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
