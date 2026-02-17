import { notFound } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import styles from '../product.module.css';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel';
import { Metadata } from 'next';

// This is a Server Component
async function getProduct(slug: string) {
    try {
        const res = await fetch(`http://localhost:3001/api/products?name=${slug}`, {
            cache: 'no-store' // Ensure fresh data
        });

        if (!res.ok) return null;

        const data = await res.json();
        // API returns array, we need the first item
        return data.data?.[0] || null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Product Not Found | WonderToys',
        };
    }

    return {
        title: `${product.title} | WonderToys`,
        description: `Buy ${product.title} at WonderToys. Best price: ₹${product.price}.`,
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    console.log("product --->", product)
    if (!product) {
        notFound();
    }

    return (
        <>
            <Header />
            <main className={styles.container}>
                <Link href="/shop" className={styles.backBtn} style={{ marginBottom: '1rem', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'inherit' }}>
                    <ArrowLeft size={20} /> Back to Shop
                </Link>

                <div className={styles.productWrapper}>
                    <div className={styles.imageSection}>
                        <ImageCarousel
                            images={product.images || (product.imageUrl ? [product.imageUrl] : [])}
                            alt={product.title}
                            placeholderColor={product.color}
                        />
                    </div>

                    <div className={styles.infoSection}>
                        <div>
                            <span className={styles.sku}>SKU: TOY-{product.id}</span>
                            <h1 className={styles.title}>{product.name}</h1>
                            <div className={styles.rating}>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        fill={i < (product.rating || 5) ? "#f1c40f" : "none"}
                                        color={i < (product.rating || 5) ? "#f1c40f" : "#ddd"}
                                    />
                                ))}
                                <span>(42 reviews)</span>
                            </div>
                        </div>

                        <div className={styles.price}>
                            ₹{Number(product?.price)}
                        </div>

                        <p className={styles.description}>
                            This amazing {product.title} is perfect for kids of all ages.
                            Made with safe, non-toxic materials and designed to provide hours of {product.category} fun.
                            Great for developing skills and imagination!
                        </p>

                        <div className={styles.actions}>
                            <AddToCartButton product={product} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
