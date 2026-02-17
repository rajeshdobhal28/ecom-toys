import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css'; // Reuse parent styles
import Link from 'next/link';
import { CATEGORIES, getCategoryName } from '@/lib/data';

async function getProducts(category: string = '') {
	try {
		const res = await fetch(`http://localhost:3001/api/products?category=${encodeURIComponent(category)}`, {
			cache: 'no-store'
		});

		if (!res.ok) {
			// If 404 or error, return empty
			return [];
		}

		const data = await res.json();
		return data.data || [];
	} catch (error) {
		console.error('Error loading products for category:', error);
		return [];
	}
}

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

const Shop = async ({ params }: { params: Promise<{ category: string }> }) => {
	const { category } = await params;
	const categoryName = getCategoryName(category);

	const products = await getProducts(category);

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
									<Link href="/shop" className={`${styles.filterLink} ${!category ? styles.active : ''}`}>All Toys</Link>
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
						</div>

						<div className={styles.grid}>
							{products.map((product: any) => (
								<ProductCard
									key={product.id}
									id={product.id}
									title={product.name}
									price={product.price}
									rating={5}
									imageUrl={product.images && product.images.length > 0 ? product.images[0] : undefined}
									category={product.category}
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

export default Shop;
