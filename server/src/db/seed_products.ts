import { query } from './index';

const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string, err: any) => console.error(`[ERROR] ${msg}`, err),
};

const products = [
  // Educational
  {
    name: 'Alphabet Learning Blocks',
    sku: 'EDU001',
    slug: 'alphabet-learning-blocks',
    description: 'Set of 26 colorful wooden blocks with letters and numbers.',
    short_description: 'Learn abc with wooden blocks.',
    category: 'Educational',
    price: 29.99,
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800',
    ],
  },
  {
    name: 'Solar System Puzzle',
    sku: 'EDU002',
    slug: 'solar-system-puzzle',
    description: 'Glow in the dark solar system floor puzzle.',
    short_description: 'Explore space with this puzzle.',
    category: 'Educational',
    price: 19.99,
    images: [
      'https://images.unsplash.com/photo-1628287532392-411a37c9809c?w=800',
    ],
  },
  // softtoys
  {
    name: 'Cuddly Teddy Bear',
    sku: 'SFT001',
    slug: 'cuddly-teddy-bear',
    description: 'Super soft brown teddy bear, perfect for hugs.',
    short_description: 'Classic soft teddy bear.',
    category: 'softtoys',
    price: 24.99,
    images: ['https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800'],
  },
  {
    name: 'Plush Elephant',
    sku: 'SFT002',
    slug: 'plush-elephant',
    description: 'Adorable grey elephant plush toy with big ears.',
    short_description: 'Soft elephant plushie.',
    category: 'softtoys',
    price: 22.5,
    images: [
      'https://images.unsplash.com/photo-1585644198363-2776c5b96799?w=800',
    ],
  },
  // ArtsAndCrafts
  {
    name: 'DIY Painting Kit',
    sku: 'ART001',
    slug: 'diy-painting-kit',
    description: 'Complete painting set with canvas, paints, and brushes.',
    short_description: 'Unleash your creativity.',
    category: 'ArtsAndCrafts',
    price: 34.99,
    images: [
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    ],
  },
  {
    name: 'Clay Modeling Set',
    sku: 'ART002',
    slug: 'clay-modeling-set',
    description: 'Non-toxic colorful clay with modeling tools.',
    short_description: 'Sculpt fun shapes.',
    category: 'ArtsAndCrafts',
    price: 15.99,
    images: [
      'https://images.unsplash.com/photo-1516961642265-531546e84af2?w=800',
    ],
  },
  // Outdoor
  {
    name: 'Kids Garden Set',
    sku: 'OUT001',
    slug: 'kids-garden-set',
    description: 'Wheelbarrow, shovel, and rake for little gardeners.',
    short_description: 'Fun in the garden.',
    category: 'Outdoor',
    price: 45.0,
    images: [
      'https://images.unsplash.com/photo-1587396001004-972172772714?w=800',
    ],
  },
  {
    name: 'Bubble Machine',
    sku: 'OUT002',
    slug: 'bubble-machine',
    description: 'Automatic bubble blower for endless outdoor fun.',
    short_description: 'Bubbles everywhere!',
    category: 'Outdoor',
    price: 18.99,
    images: [
      'https://images.unsplash.com/photo-1533228876829-65c94e7b5025?w=800',
    ],
  },
];

const seedProducts = async () => {
  try {
    // Optional: Clear existing products to avoid duplicates if running multiple times
    // await query('DELETE FROM products');

    for (const product of products) {
      const queryText = `
                INSERT INTO products (name, sku, slug, description, short_description, category, price, images)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (sku) DO NOTHING;
            `;
      const values = [
        product.name,
        product.sku,
        product.slug,
        product.description,
        product.short_description,
        product.category,
        product.price,
        product.images,
      ];
      await query(queryText, values);
    }
    logger.info('✅ Dummy products seeded successfully');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Error seeding products', err);
    process.exit(1);
  }
};

seedProducts();
