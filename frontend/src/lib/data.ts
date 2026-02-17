export interface Product {
    id: string | number;
    title: string;
    price: number;
    rating: number;
    category: string;
    slug: string;
    color?: string; // keeping for backward compatibility
    imageUrl?: string; // added for new DB products
}

export const CATEGORIES = [
    { name: 'Educational', slug: 'educational' },
    { name: 'Outdoor Fun', slug: 'outdoor' },
    { name: 'Soft & Plush', slug: 'softtoys' },
    { name: 'Arts & Crafts', slug: 'arts' },
];

export function getCategoryName(slug: string) {
    const category = CATEGORIES.find(c => c.slug === slug);
    return category ? category.name : 'All Toys';
}
