import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { API, makeApiRequest } from '@/api/api';
import styles from './ReviewModal.module.css';

interface ReviewModalProps {
    productId: string | number;
    productName: string;
    existingReview: { rating: number; comment: string } | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReviewModal({
    productId,
    productName,
    existingReview,
    onClose,
    onSuccess,
}: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment || '');
        }
    }, [existingReview]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await makeApiRequest(API.UPSERT_REVIEW, {
                productId,
                rating,
                comment,
            });

            if (response.status === 'success') {
                onSuccess();
            } else {
                setError(response.message || 'Failed to submit review');
            }
        } catch (err: any) {
            setError('An error occurred while submitting your review.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>

                <h2 className={styles.title}>
                    {existingReview ? 'Update Review' : 'Write a Review'}
                </h2>
                <p className={styles.subtitle}>for {productName}</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={styles.starBtn}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            >
                                <Star
                                    size={32}
                                    fill={(hoverRating || rating) >= star ? '#f1c40f' : 'none'}
                                    color={(hoverRating || rating) >= star ? '#f1c40f' : '#ddd'}
                                    className={styles.starIcon}
                                />
                            </button>
                        ))}
                    </div>

                    <div className={styles.textareaContainer}>
                        <label htmlFor="comment" className={styles.label}>
                            Your Comment (Optional)
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you think about this toy?"
                            className={styles.textarea}
                            rows={4}
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading || rating === 0}
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}
