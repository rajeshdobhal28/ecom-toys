import Link from "next/link";
import styles from "./Hero.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <span className={styles.badge}>✨ New Collection 2026</span>
          <h1 className={styles.title}>
            Spark Joy in <br />
            <span className={styles.highlight}>Every Playtime</span>
          </h1>
          <p className={styles.description}>
            Discover toys that inspire creativity, learning, and endless smiles.
            Carefully curated to bring joy to your little one&apos;s world.
          </p>
          <div className={styles.actions}>
            <Link href="/products" className="btn btn-primary">
              Shop Now
            </Link>
            <Link href="/products" className="btn btn-outline">
              Browse All
            </Link>
          </div>
        </div>
        <div className={styles.visual}>
          <div className={styles.circle1} />
          <div className={styles.circle2} />
          <div className={styles.heroEmoji}>🚀</div>
          <div className={styles.floatingToy1}>🧸</div>
          <div className={styles.floatingToy2}>🎨</div>
          <div className={styles.floatingToy3}>🎯</div>
        </div>
      </div>
      <div className={styles.wave}>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0L48 8.875C96 17.75 192 35.5 288 44.375C384 53.25 480 53.25 576 44.375C672 35.5 768 17.75 864 17.75C960 17.75 1056 35.5 1152 44.375C1248 53.25 1344 53.25 1392 53.25H1440V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z"
            fill="#FFFDF5"
          />
        </svg>
      </div>
    </section>
  );
}
