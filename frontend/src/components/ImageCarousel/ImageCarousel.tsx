"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ImageCarousel.module.css';

interface ImageCarouselProps {
    images: string[];
    alt: string;
    placeholderColor?: string;
}

export default function ImageCarousel({ images, alt, placeholderColor = '#ff6b6b' }: ImageCarouselProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const hasImages = images && images.length > 0;
    const hasMultiple = hasImages && images.length > 1;

    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // If no images at all
    if (!hasImages) {
        return (
            <div className={styles.carouselContainer}>
                <div className={styles.placeholder} style={{ color: placeholderColor }}>
                    🧸
                </div>
            </div>
        );
    }

    return (
        <div className={styles.carouselContainer}>
            <div className={styles.imageWrapper}>
                <img
                    src={images[selectedIndex]}
                    alt={`${alt} - View ${selectedIndex + 1}`}
                    className={styles.mainImage}
                />

                {hasMultiple && (
                    <>
                        <button onClick={prevImage} className={`${styles.navBtn} ${styles.prevBtn}`} aria-label="Previous Image">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextImage} className={`${styles.navBtn} ${styles.nextBtn}`} aria-label="Next Image">
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {hasMultiple && (
                <div className={styles.thumbnails}>
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            className={`${styles.thumbBtn} ${idx === selectedIndex ? styles.activeThumb : ''}`}
                            onClick={() => setSelectedIndex(idx)}
                        >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
