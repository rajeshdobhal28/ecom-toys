export interface Product {
    id: number;
    title: string;
    price: number;
    rating: number;
    category: string;
    color: string;
    slug: string;
}

export const CATEGORIES = [
    { name: 'Educational', slug: 'educational' },
    { name: 'Outdoor Fun', slug: 'outdoor' },
    { name: 'Soft & Plush', slug: 'softtoys' },
    { name: 'Arts & Crafts', slug: 'arts' },
];

export const ALL_PRODUCTS: Product[] = [
    { id: 1, title: 'Super Space Rocket', price: 49.99, rating: 5, category: 'Educational', slug: 'super-space-rocket', color: '#A29BFE' },
    { id: 2, title: 'Cuddly Bear "Coco"', price: 29.99, rating: 4, category: 'Soft & Plush', slug: 'cuddly-bear-coco', color: '#FECCA3' },
    { id: 3, title: 'Mega Building Blocks', price: 34.50, rating: 5, category: 'Educational', slug: 'mega-building-blocks', color: '#81ECEC' },
    { id: 4, title: 'Artistic Paint Set', price: 24.99, rating: 4, category: 'Arts & Crafts', slug: 'artistic-paint-set', color: '#FAB1A0' },
    { id: 5, title: 'Soccer Star Ball', price: 19.99, rating: 5, category: 'Outdoor Fun', slug: 'soccer-star-ball', color: '#74B9FF' },
    { id: 6, title: 'Remote Control Car', price: 45.00, rating: 4, category: 'Outdoor Fun', slug: 'remote-control-car', color: '#FF7675' },
    { id: 7, title: 'Science Lab Kit', price: 39.99, rating: 5, category: 'Educational', slug: 'science-lab-kit', color: '#A29BFE' },
    { id: 8, title: 'Giant Giraffe Plush', price: 59.99, rating: 5, category: 'Soft & Plush', slug: 'giant-giraffe-plush', color: '#FFEAA7' },
    { id: 9, title: 'Water Gun Blaster', price: 15.99, rating: 3, category: 'Outdoor Fun', slug: 'water-gun-blaster', color: '#00CEC9' },
    { id: 10, title: 'Origami Paper Set', price: 12.50, rating: 4, category: 'Arts & Crafts', slug: 'origami-paper-set', color: '#FDA7DF' },
];

export function getProductsByCategory(categorySlug: string) {
    if (categorySlug === 'all') return ALL_PRODUCTS;

    // Find category name from slug
    const category = CATEGORIES.find(c => c.slug === categorySlug);
    if (!category) return [];

    return ALL_PRODUCTS.filter(p => p.category === category.name);
}

export function getCategoryName(slug: string) {
    const category = CATEGORIES.find(c => c.slug === slug);
    return category ? category.name : 'All Toys';
}
