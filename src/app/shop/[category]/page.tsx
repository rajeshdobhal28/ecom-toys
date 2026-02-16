import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from '../page.module.css'; // Reuse parent styles
import Link from 'next/link';
import { CATEGORIES, getProductsByCategory, getCategoryName } from '@/lib/data';
import { notFound } from 'next/navigation';

// SEO: Generate static paths for all categories
export async function generateStaticParams() {
    return CATEGORIES.map((category) => ({
        category: category.slug,
    }));
}

// SEO: Dynamic Metadata
// SEO: Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const categoryName = getCategoryName(category);
    return {
        title: `${categoryName} | WonderToys Shop`,
        description: `Shop the best ${categoryName.toLowerCase()} for kids at WonderToys.`,
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const products = getProductsByCategory(category);
    const categoryName = getCategoryName(category);

    if (!products.length && category !== 'all') {
        // In a real app we might 404
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={`container ${styles.container}`}>

                    <aside className={styles.sidebar}>
                        <div className={styles.filterGroup}>
                            <h4>Category</h4>
                            <ul>
                                <li>
                                    <Link href="/shop" className={styles.filterLink}>All Toys</Link>
                                </li>
                                {CATEGORIES.map(cat => (
                                    <li key={cat.slug}>
                                        <Link
                                            href={`/shop/${cat.slug}`}
                                            className={`${styles.filterLink} ${category === cat.slug ? styles.active : ''}`}
                                        >
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    <section className={styles.content}>
                        <div className={styles.topBar}>
                            <h1>{categoryName}</h1>
                            <p>{products.length} results found</p>
                        </div>

                        <div className={styles.grid}>
                            {products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    title={product.title}
                                    price={product.price}
                                    rating={product.rating}
                                    imageColor={product.color}
                                />
                            ))}
                            {products.length === 0 && (
                                <p>No products found in this category.</p>
                            )}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
