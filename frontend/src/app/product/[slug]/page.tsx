import { notFound } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import styles from '../product.module.css';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel';
import ProductReviews from '@/components/ProductReviews/ProductReviews';
import { Metadata } from 'next';

// Helper to reliably map an ID string to a soft pastel category color
const getDeterministicColor = (id: string | number) => {
  const colors = ['#ffeaa7', '#74b9ff', '#ff7675', '#a29bfe', '#81ecec', '#fab1a0'];
  const num = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[num % colors.length];
};

// This is a Server Component
async function getProduct(slug: string) {
  try {
    const res = await fetch(`http://localhost:3001/api/products?slug=${slug}`, {
      cache: 'no-store', // Ensure fresh data
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  console.log('product --->', product);
  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <Link
          href="/shop"
          className={styles.backBtn}
          style={{
            marginBottom: '1rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <ArrowLeft size={20} /> Back to Shop
        </Link>

        <div className={styles.productWrapper}>
          <div
            className={styles.imageSection}
            style={{
              background: `radial-gradient(circle, #ffffff 0%, ${product.color || getDeterministicColor(product.id)} 100%)`,
              borderRadius: '16px',
              padding: '2rem'
            }}
          >
            {product.quantity === 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(214, 48, 49, 0.9)',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  textTransform: 'uppercase',
                  borderRadius: '8px',
                  letterSpacing: '2px',
                  zIndex: 10,
                  boxShadow: '0 4px 15px rgba(214, 48, 49, 0.4)',
                }}
              >
                Sold Out
              </div>
            )}
            <ImageCarousel
              images={
                product.images || (product.imageUrl ? [product.imageUrl] : [])
              }
              alt={product.title}
              placeholderColor={product.color}
            />
          </div>

          <div className={styles.infoSection}>
            <div>
              <span className={styles.sku}>SKU: {product.sku || `TOY-${product.id}`}</span>
              {product.brand && <span className={styles.brand}>{product.brand}</span>}
              <h1 className={styles.title}>{product.name}</h1>
            </div>

            <div className={styles.price}>₹{Number(product?.price)}</div>

            <p className={styles.description}>
              This amazing {product.title} is perfect for kids of all ages. Made
              with safe, non-toxic materials and designed to provide hours of{' '}
              {product.category} fun. Great for developing skills and
              imagination!
            </p>

            <div className={styles.actions}>
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>

        <ProductReviews productId={product.id} />
      </main>
      <Footer />
    </>
  );
}
