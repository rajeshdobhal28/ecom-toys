import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.scss";

interface ProductCardProps {
  id: string | number;
  title: string;
  price: number | string;
  rating?: number;
  imageUrl?: string;
  category?: string;
  slug?: string;
  review_count?: number;
}

const getCardColor = (id: string | number) => {
  const colors = ["#ffeaa7", "#74b9ff", "#ff7675", "#a29bfe", "#81ecec", "#fab1a0"];
  const num = String(id)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[num % colors.length];
};

export default function ProductCard({
  id,
  title,
  price,
  rating = 0,
  imageUrl,
  category = "General",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  slug,
  review_count = 0,
}: ProductCardProps) {
  return (
    <Link href={`/products`} className={styles.cardLink}>
      <div className={styles.card}>
        <div
          className={styles.imageWrap}
          style={{
            background: `radial-gradient(circle, #ffffff 0%, ${getCardColor(id)} 100%)`,
          }}
        >
          <span className={styles.category}>{category}</span>
          {imageUrl ? (
            <Image src={imageUrl} alt={title} width={300} height={300} className={styles.image} />
          ) : (
            <span className={styles.emoji}>🧸</span>
          )}
        </div>

        <div className={styles.details}>
          {rating > 0 && (
            <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < Math.round(Number(rating))
                      ? styles.starFilled
                      : styles.starEmpty
                  }
                  fill={i < Math.round(Number(rating)) ? "currentColor" : "none"}
                />
              ))}
              <span className={styles.reviewCount}>({review_count})</span>
            </div>
          )}

          <h3 className={styles.title}>{title}</h3>

          <div className={styles.footer}>
            <span className={styles.price}>₹{Number(price).toFixed(2)}</span>
            <button className={styles.addBtn} aria-label="Add to Cart">
              <ShoppingCart size={16} />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
