import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css'; // Reusing styles from shop/page.module.css if possible, but let's assume we need to verify import
import Link from 'next/link';
import { ALL_PRODUCTS, CATEGORIES } from '@/lib/data';
import { Filter } from 'lucide-react';

export const metadata = {
  title: 'Shop All Toys | WonderToys',
  description: 'Browse our complete collection of educational, outdoor, and plush toys for kids of all ages.',
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={`container ${styles.container}`}>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <h4>Category</h4>
              <ul>
                <li>
                  <Link href="/shop" className={`${styles.filterLink} ${styles.active}`}>All Toys</Link>
                </li>
                {CATEGORIES.map(cat => (
                  <li key={cat.slug}>
                    <Link href={`/shop/${cat.slug}`} className={styles.filterLink}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Content */}
          <section className={styles.content}>
            <div className={styles.topBar}>
              <h1>All Toys</h1>
              <p>{ALL_PRODUCTS.length} results found</p>
            </div>

            <div className={styles.grid}>
              {ALL_PRODUCTS.map(product => (
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
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
