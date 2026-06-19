'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API, makeApiRequest } from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import Header from '@/components/Header/Header';
import ReviewModal from '@/components/ReviewModal/ReviewModal';

interface OrderItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string | null;
}

interface Order {
  id: string;
  items: OrderItem[];
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

  // Newest-first flat list of orders.
  // const sortedOrders = [...orders].sort(
  //   (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  // );

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
              {orders.map((order) => (
                <div key={order.id} className={styles.dateGroupCard}>
                  <div className={styles.orderSummaryHeader}>
                    <div className={styles.orderMeta}>
                      <span className={styles.orderIdText}>
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className={styles.orderDate}>
                        {new Date(order.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      
                    </div>
                    <div className={styles.orderTotalBox}>
                      <span className={styles.orderTotalLabel}>Total Paid</span>
                      <span className={styles.totalPrice}>
                        ₹{Number(order.total_price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.dateOrdersList}>
                    {order.items.map((item) => {
                      const existingReview = reviews[item.productId];

                      return (
                        <div key={item.productId} className={styles.orderItem}>
                          <div className={styles.imageContainer}>
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                className={styles.productImage}
                              />
                            ) : (
                              <div className={styles.placeholderImage}></div>
                            )}
                          </div>

                          <div className={styles.productDetails}>
                            <h3 className={styles.productName}>{item.name}</h3>
                            <p className={styles.quantity}>Qty: {item.quantity}</p>
                            <span
                        className={`${styles.status} ${styles[order.status?.toLowerCase()]} ${styles.statusBadge}`}
                      >
                        {order.status}
                      </span>
                          </div>

                          <div className={styles.priceDetails}>
                            <button
                              className={styles.reviewBtn}
                              onClick={() => openReviewModal(item.productId, item.name)}
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
