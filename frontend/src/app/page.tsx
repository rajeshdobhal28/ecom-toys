import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import ProductCard from '@/components/ProductCard/ProductCard';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';
import { Truck, ShieldCheck, Smile, Gift } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const products = [
    { id: 1, title: 'Super Space Rocket', price: 49.99, rating: 5, color: '#A29BFE' },
    { id: 2, title: 'Cuddly Bear "Coco"', price: 29.99, rating: 4, color: '#FECCA3' },
    { id: 3, title: 'Mega Building Blocks', price: 34.50, rating: 5, color: '#81ECEC' },
    { id: 4, title: 'Artistic Paint Set', price: 24.99, rating: 4, color: '#FAB1A0' },
  ];

  const categories = [
    { name: 'Educational Toys', icon: '🧠', color: '#FFEAA7', slug: 'educational' },
    { name: 'Outdoor Fun Toys', icon: '⚽', color: '#74B9FF', slug: 'outdoor' },
    { name: 'Soft & Plush Toys', icon: '🧸', color: '#FF7675', slug: 'softtoys' },
    { name: 'Arts & Crafts Toys', icon: '🎨', color: '#A29BFE', slug: 'arts' },
  ];

  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Features / Trust Badges */}
        <section className={styles.features}>
          <div className={`container ${styles.featuresGrid}`}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><Truck size={32} /></div>
              <h3>Fast Shipping</h3>
              <p>Free delivery on orders over ₹50</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><ShieldCheck size={32} /></div>
              <h3>Safe & Non-Toxic</h3>
              <p>Certified safe materials for kids</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><Smile size={32} /></div>
              <h3>Happiness Guarantee</h3>
              <p>30-day return policy if not loved</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><Gift size={32} /></div>
              <h3>Free Gift Wrapping</h3>
              <p>Perfect for birthdays & holidays</p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Shop by Category</h2>
            <div className={styles.categoryGrid}>
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/shop/${cat.slug}`} className={styles.link}>
                  <div key={cat.name} className={styles.categoryCard} style={{ backgroundColor: cat.color }}>
                    <span className={styles.catIcon}>{cat.icon}</span>
                    <h3 className={styles.catName}>{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className={styles.section} style={{ backgroundColor: '#F9FAFB' }}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Trending Now</h2>
              <a href="/shop" className="btn btn-secondary">View All</a>
            </div>
            <div className={styles.productGrid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  rating={product.rating}
                  imageColor={product.color}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaCard}>
              <h2>Join the WonderToys Family!</h2>
              <p>Get 10% off your first order and exclusive access to new toy drops.</p>
              <div className={styles.inputGroup}>
                <input type="email" placeholder="Enter your email" />
                <button className="btn btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
