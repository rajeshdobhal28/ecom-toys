"use client";

import Hero from "@/features/Hero/Hero";
import TrustBar from "@/features/TrustBar/TrustBar";
import ProductCard from "@/features/ProductCard/ProductCard";
import { useAppSelector } from "@/store/hooks";
import styles from "./page.module.scss";
import Products from "@/features/Products/Products";

export default function Home() {
  const products = useAppSelector((state) => state.products.items);
  const featured = products.slice(0, 4);

  return (
    <>
      <Hero />
      <TrustBar />

      <section className={`section ${styles.featured}`}>
        <div className="container">
          <h2 className="section-title">
            Our Most-Loved <span className={styles.highlight}>Toys</span>
          </h2>
          <p className="section-subtitle">
            Hand-picked favorites that keep kids engaged and parents happy.
          </p>

          <div className={styles.grid}>
            <Products type="trending" />
          </div>
        </div>
      </section>
    </>
  );
}
