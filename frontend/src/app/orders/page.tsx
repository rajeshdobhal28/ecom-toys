"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API, makeApiRequest } from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import Header from '@/components/Header/Header';

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
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await makeApiRequest(API.GET_ORDERS, {});
            if (res.status === 'success') {
                setOrders(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
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

    return (
        <>
            <Header />
            <div className={styles.containerWrapper}>
                <div className={styles.container}>
                    {/* <h1 className={styles.title}>My Orders</h1> */}

                    {orders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>You haven't placed any orders yet.</p>
                        </div>
                    ) : (
                        <div className={styles.ordersList}>
                            {orders.map((order) => (
                                <div key={order.id} className={styles.orderCard}>
                                    <div className={styles.orderHeader}>
                                        <div className={styles.orderInfo}>
                                            <span className={styles.orderDate}>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                            <span className={styles.orderId}>ID: {order.id}</span>
                                        </div>
                                        <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className={styles.orderContent}>
                                        <div className={styles.imageContainer}>
                                            {order.product_images && order.product_images[0] ? (
                                                <Image
                                                    src={order.product_images[0]}
                                                    alt={order.product_name}
                                                    width={80}
                                                    height={80}
                                                    className={styles.productImage}
                                                />
                                            ) : (
                                                <div className={styles.placeholderImage}></div>
                                            )}
                                        </div>

                                        <div className={styles.productDetails}>
                                            <h3 className={styles.productName}>{order.product_name}</h3>
                                            <p className={styles.quantity}>Qty: {order.quantity}</p>
                                        </div>

                                        <div className={styles.priceDetails}>
                                            <p className={styles.totalPrice}>₹{Number(order.total_price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
