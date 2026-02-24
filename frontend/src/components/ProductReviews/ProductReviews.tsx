'use client';

import React, { useEffect, useState } from 'react';
import { Star, User } from 'lucide-react';
import Image from 'next/image';
import { API, makeApiRequest } from '@/api/api';
import styles from './ProductReviews.module.css';

interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    name: string;
    picture: string | null;
}

export default function ProductReviews({ productId }: { productId: string | number }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await makeApiRequest({
                    url: `${API.GET_PRODUCT_REVIEWS.url}/${productId}`,
                    method: API.GET_PRODUCT_REVIEWS.method,
                }, {});
                if (response.status === 'success') {
                    setReviews(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId]);

    if (loading) {
        return <div className={styles.loading}>Loading reviews...</div>;
    }

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
        : 0;

    return (
        <div className={styles.reviewsContainer}>
            <h2 className={styles.header}>Customer Reviews</h2>

            {totalReviews === 0 ? (
                <p className={styles.noReviews}>No reviews yet. Be the first to review this product!</p>
            ) : (
                <>
                    <div className={styles.summaryContainer}>
                        <div className={styles.averageRatingBox}>
                            <span className={styles.averageNumber}>{averageRating}</span>
                            <div className={styles.starsSummary}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={20}
                                        fill={star <= Number(averageRating) ? 'var(--accent)' : 'none'}
                                        color={star <= Number(averageRating) ? 'var(--accent)' : 'var(--border)'}
                                    />
                                ))}
                            </div>
                            <span className={styles.totalCount}>Based on {totalReviews} reviews</span>
                        </div>
                    </div>

                    <div className={styles.reviewsList}>
                        {reviews.map((review) => (
                            <div key={review.id} className={styles.reviewCard}>
                                <div className={styles.reviewHeader}>
                                    <div className={styles.userSection}>
                                        {review.picture ? (
                                            <Image
                                                src={review.picture}
                                                alt={review.name || 'User'}
                                                width={40}
                                                height={40}
                                                className={styles.userAvatar}
                                            />
                                        ) : (
                                            <div className={styles.userAvatarPlaceholder}>
                                                <User size={20} color="var(--text-muted)" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className={styles.userName}>{review.name || 'Anonymous User'}</h4>
                                            <div className={styles.reviewDate}>
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.starsCard}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={16}
                                                fill={star <= review.rating ? 'var(--accent)' : 'none'}
                                                color={star <= review.rating ? 'var(--accent)' : 'var(--border)'}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className={styles.reviewComment}>{review.comment}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
