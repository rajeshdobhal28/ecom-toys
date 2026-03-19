import { useAppSelector } from "@/store/hooks";
import ProductCard from "../ProductCard/ProductCard";

interface IProducts {
    type: 'all' | 'trending';
    category?: string;
}

const Products = (props: IProducts) => {
    const { type, category } = props;
    let products = useAppSelector((state) => state.products.items);

    if (type === 'trending') {
        products = products.slice(0, 4);
    }

    if (category) {
        products = products.filter(
            (product) => product.category.toLowerCase() === category.toLowerCase()
        );
    }

    return products.map((product) => (
        <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            rating={product.rating}
            imageUrl={product.imageUrl}
            category={product.category}
            slug={product.slug}
            review_count={product.review_count}
        />
    ))
}

export default Products;