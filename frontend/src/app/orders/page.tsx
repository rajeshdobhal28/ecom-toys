'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API, makeApiRequest } from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import Header from '@/components/Header/Header';
import ReviewModal from '@/components/ReviewModal/ReviewModal';

interface Order {
  id: string;
  product_id: string;
  product_name: string;
  product_images: string[];
  quantity: number;
  price_at_purchase: string;
  total_price: string;
  status: string;
  created_at: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string, name: string } | null>(null);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both orders and existing user reviews in parallel
      const [ordersRes, reviewsRes] = await Promise.all([
        makeApiRequest(API.GET_ORDERS, {}),
        makeApiRequest(API.GET_USER_REVIEWS, {})
      ]);

      if (ordersRes.status === 'success') {
        setOrders(ordersRes.data);
      }

      if (reviewsRes.status === 'success') {
        // Index reviews by product_id for quick lookup
        const reviewMap: Record<string, any> = {};
        reviewsRes.data.forEach((r: any) => {
          reviewMap[r.product_id] = r;
        });
        setReviews(reviewMap);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    setReviewModalOpen(false);
    setSelectedProduct(null);
    fetchData(); // Refresh to get the updated review
  };

  if (authLoading || loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const groupedOrders: Record<string, Order[]> = {};
  orders.forEach((order) => {
    const dateStr = new Date(order.created_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groupedOrders[dateStr]) groupedOrders[dateStr] = [];
    groupedOrders[dateStr].push(order);
  });

  return (
    <>
      <Header />
      <div className={styles.containerWrapper}>
        <div className={styles.container}>
          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {Object.entries(groupedOrders).map(([date, dateOrders]) => (
                <div key={date} className={styles.dateGroupCard}>
                  <div className={styles.dateHeader}>
                    <h2>{date}</h2>
                  </div>
                  <div className={styles.dateOrdersList}>
                    {dateOrders.map((order) => {
                      const existingReview = reviews[order.product_id];

                      return (
                        <div key={order.id} className={styles.orderItem}>
                          <div className={styles.imageContainer}>
                            {order.product_images && order.product_images[0] ? (
                              <Image
                                src={order.product_images[0]}
                                alt={order.product_name}
                                fill
                                style={{ objectFit: 'cover' }}
                                className={styles.productImage}
                              />
                            ) : (
                              <div className={styles.placeholderImage}></div>
                            )}
                          </div>

                          <div className={styles.productDetails}>
                            <h3 className={styles.productName}>
                              {order.product_name}
                            </h3>
                            <p className={styles.quantity}>Qty: {order.quantity}</p>
                            <p className={styles.orderId}>Order ID: {order.id}</p>
                            <div style={{ marginTop: '0.5rem' }}>
                              <span
                                className={`${styles.status} ${styles[order.status.toLowerCase()]}`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <div className={styles.priceDetails}>
                            <p className={styles.totalPrice}>
                              ₹{Number(order.total_price).toFixed(2)}
                            </p>
                            <button
                              className={styles.reviewBtn}
                              onClick={() => openReviewModal(order.product_id, order.product_name)}
                            >
                              {existingReview ? 'Update Review' : 'Leave a Review'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {reviewModalOpen && selectedProduct && (
        <ReviewModal
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          existingReview={reviews[selectedProduct.id] || null}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </>
  );
}
