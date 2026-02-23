export interface Product {
  id: string | number;
  title: string;
  price: number;
  rating: number;
  category: string;
  slug: string;
  color?: string; // keeping for backward compatibility
  imageUrl?: string; // added for new DB products
  brand?: string;
  cost_price?: number;
}

export const CATEGORIES = [
  {
    name: 'Educational Toys',
    slug: 'educational',
    description:
      'Spark curiosity and foster learning with our range of educational toys. From STEM kits to alphabet blocks, these toys are designed to develop cognitive skills, problem-solving abilities, and creativity in children of all ages.',
  },
  {
    name: 'Outdoor Toys',
    slug: 'outdoor',
    description:
      'Encourage active play and fresh air with our exciting outdoor toys. Discover sports equipment, ride-on cars, and garden sets that promote physical development and endless backyard fun.',
  },
  {
    name: 'Soft Toys',
    slug: 'softtoys',
    description:
      'Find the perfect cuddle companion in our collection of soft and plush toys. Made with premium, child-safe materials, these adorable stuffed animals and dolls provide comfort, warmth, and imaginative play.',
  },
  {
    name: 'Arts & Crafts Toys',
    slug: 'arts',
    description:
      "Unleash your child's inner artist with our arts and crafts toys. Explore painting sets, DIY kits, and modeling clay that inspire self-expression, fine motor skills, and artistic confidence.",
  },
];

export function getCategoryName(slug: string) {
  const category = CATEGORIES.find((c) => c.slug === slug);
  return category ? category.name : 'All Toys';
}

export function getCategoryDescription(slug: string) {
  const category = CATEGORIES.find((c) => c.slug === slug);
  return category
    ? category.description
    : "Welcome to WonderToys! Explore our wide selection of safe, high-quality, and fun toys for every age. Whether you're looking for learning tools or cuddle buddies, we have the perfect gift for your little one.";
}
