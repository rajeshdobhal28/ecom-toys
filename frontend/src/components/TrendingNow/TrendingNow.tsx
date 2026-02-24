'use client';

import { useEffect, useState } from 'react';
import { API, makeApiRequest } from '@/api/api';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from '@/app/page.module.css'; // Reusing home page styles

export default function TrendingNow() {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  // Fallback static products in case of error or empty state
  const staticProducts = [
    {
      id: 1,
      title: 'Super Space Rocket',
      price: 49.99,
      rating: 5,
      color: '#A29BFE',
    },
    {
      id: 2,
      title: 'Cuddly Bear "Coco"',
      price: 29.99,
      rating: 4,
      color: '#FECCA3',
    },
    {
      id: 3,
      title: 'Mega Building Blocks',
      price: 34.5,
      rating: 5,
      color: '#81ECEC',
    },
    {
      id: 4,
      title: 'Artistic Paint Set',
      price: 24.99,
      rating: 4,
      color: '#FAB1A0',
    },
  ];

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await makeApiRequest(API.GET_TRENDING_PRODUCTS, {});
        if (response.status === 'success') {
          setTrendingProducts(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch trending products:', error);
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="container">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Trending Now</h2>
        <a href="/shop" className="btn btn-secondary">
          View All
        </a>
      </div>
      <div className={styles.productGrid}>
        {loadingTrending ? (
          <p>Loading trending products...</p>
        ) : trendingProducts.length > 0 ? (
          trendingProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.name}
              price={product.price}
              rating={product.average_rating}
              review_count={product.review_count}
              imageUrl={product.images?.[0]}
              slug={product.slug}
              quantity={product.quantity}
            />
          ))
        ) : (
          staticProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              rating={product.rating}
              imageColor={product.color}
            />
          ))
        )}
      </div>
    </div>
  );
}
