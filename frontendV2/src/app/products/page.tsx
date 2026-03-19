"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import Products from "@/features/Products/Products";
import Filters from "@/features/Filters/Filters";

export default function ProductsPage() {

  return (
    <section className={styles.productsPage}>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            All <span className={styles.highlight}>Toys</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Browse our complete collection of safe, fun, and educational toys.
          </p>
        </div>

        <div className={styles.layout}>
          {/* Sidebar — filters */}
          <Filters />

          {/* Main content — product grid */}
          <div className={styles.content}>
            <div className={styles.grid}>
              <Products type="all" category={undefined} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
