import { query } from './index';

const logger = {
    info: (msg: string) => console.log(`[INFO] ${msg}`),
    error: (msg: string, err: any) => console.error(`[ERROR] ${msg}`, err),
};

const newProducts = [
    {
        "name": "Little Chef Dream Coffee Machine",
        "slug": "little-chef-dream-coffee-machine",
        "brand": "MY HOME",
        "category": "educational",
        "type": "kitchen toy",
        "short_description": "A fun and interactive coffee machine toy for imaginative play.",
        "description": "This vibrant blue coffee machine toy features realistic controls and a steaming function, allowing children to pretend to brew coffee. It includes a cup for serving and encourages imaginative play, helping kids develop practical skills in a fun way.",
        "quantity": 5,
        "price": 1000,
        "sku": "9EF7889A"
    },
    {
        "name": "M82A1 Sniper Rifle",
        "slug": "m82a1-sniper-rifle",
        "brand": null,
        "category": "outdoor",
        "type": "toy gun",
        "short_description": "A versatile sniper rifle toy designed for ages 14 and up.",
        "description": "The M82A1 Sniper Rifle features a colorful design with electric and manual firing options. It uses 7mm-8mm water bullets, making it suitable for outdoor play. The packaging highlights its automatic and manual capabilities, appealing to older children and teens.",
        "quantity": 5,
        "price": 1000,
        "sku": "912A8618"
    },
    {
        "name": "Funny Train Domino Set",
        "slug": "funny-train-domino-set",
        "brand": "Domino",
        "category": "educational",
        "type": "toy",
        "short_description": "A fun and interactive domino train set for kids aged 3 and up.",
        "description": "This colorful Funny Train Domino Set features a playful train design with a smiling face, equipped with a mechanism to place and knock down colorful dominoes. The set includes various domino pieces in bright colors, encouraging creativity and fine motor skills as children arrange and topple them. The train can change direction, adding an element of surprise and excitement to playtime.",
        "quantity": 5,
        "price": 1000,
        "sku": "D24CDD79"
    },
    {
        "name": "Interactive Learning Book",
        "slug": "interactive-learning-book",
        "brand": "Study Book",
        "category": "educational",
        "type": "book",
        "short_description": "An engaging educational book designed for parent-child interaction.",
        "description": "This interactive learning book features colorful illustrations and sounds to teach children about letters, animals, vehicles, numbers, relationships, and musical instruments. It encourages hands-on learning and observation, making it a fun educational tool for young learners.",
        "quantity": 5,
        "price": 1000,
        "sku": "02D1CD91"
    },
    {
        "name": "Colorful LCD Writing Tablet",
        "slug": "colorful-lcd-writing-tablet",
        "brand": null,
        "category": "educational",
        "type": "tablet",
        "short_description": "An innovative LCD writing tablet for creative expression and note-taking.",
        "description": "This 8.5-inch LCD writing tablet features a colorful screen that allows users to draw, write, and erase easily. It is designed for both adults and children, making it perfect for sketching, to-do lists, and memo pads. The tablet includes a stylus for writing and a lock function to save your content. Its lightweight design makes it portable for use at home, school, or on the go.",
        "quantity": 5,
        "price": 1000,
        "sku": "7A9BC764"
    },
    {
        "name": "Intelligent Baby Phone",
        "slug": "intelligent-baby-phone",
        "brand": "Play & Smile",
        "category": "educational",
        "type": "toy",
        "short_description": "A fun and interactive baby phone designed for early learning.",
        "description": "This colorful baby phone features multiple buttons with animal sounds and melodies, encouraging auditory development. It includes a cute rabbit design on top and is suitable for children aged 6 months and older. The phone is designed to be lightweight and easy for little hands to hold, making it an engaging toy for toddlers.",
        "quantity": 5,
        "price": 1000,
        "sku": "16214440"
    },
    {
        "name": "Magnetic Bar Blocks",
        "slug": "magnetic-bar-blocks",
        "brand": "Ditfun Toys",
        "category": "educational",
        "type": "building",
        "short_description": "A set of colorful magnetic bar blocks for creative building.",
        "description": "This 64-piece set of Magnetic Bar Blocks features vibrant colors and various shapes that connect through magnetic bars and balls. Designed to enhance children's creativity and coordination, it allows for the construction of diverse structures, promoting imaginative play and fine motor skills.",
        "quantity": 5,
        "price": 1000,
        "sku": "92928B89"
    },
    {
        "name": "String Hockey Junior",
        "slug": "string-hockey-junior",
        "brand": "Toyshine",
        "category": "educational",
        "type": "game",
        "short_description": "A fun and engaging wooden string hockey game for kids.",
        "description": "String Hockey Junior is a multi-player wooden game designed to enhance creativity and provide hours of entertainment. It features a simple layout with black and white pucks, encouraging friendly competition and teamwork among players.",
        "quantity": 5,
        "price": 1000,
        "sku": "67C3EF65"
    },
    {
        "name": "Panda Silicone Night Light",
        "slug": "panda-silicone-night-light",
        "brand": "null",
        "category": "educational",
        "type": "night light",
        "short_description": "A cute panda-shaped silicone night light with ambient and colorful lighting options.",
        "description": "This adorable panda night light features a soft silicone design, perfect for children's rooms. It offers ambient and colorful lighting, controlled by a simple tap. The light is compact, measuring 106x112x136mm, and is powered by a 1.5W input, making it both functional and charming.",
        "quantity": 5,
        "price": 1000,
        "sku": "27C372B6"
    },
    {
        "name": "Interactive Peppa Pig Toy",
        "slug": "interactive-peppa-pig-toy",
        "brand": "Peppa Pig",
        "category": "educational",
        "type": "toy",
        "short_description": "An interactive Peppa Pig toy that engages children with songs and dialogues.",
        "description": "This Peppa Pig toy features a cheerful design with Peppa in her signature red dress adorned with flowers. It offers interactive play, allowing children to engage with Peppa through touch, music, and storytelling. The toy is designed for kids aged 3 and above, promoting fun learning experiences with songs, rhymes, and playful dialogues.",
        "quantity": 5,
        "price": 1000,
        "sku": "EFEE7AEE"
    },
    {
        "name": "Candy Flower Stress Buster",
        "slug": "candy-flower-stress-buster",
        "brand": null,
        "category": "educational",
        "type": "toy",
        "short_description": "A colorful stress-relief toy designed for fun and relaxation.",
        "description": "The Candy Flower Stress Buster features a vibrant, multi-colored design with a large, round flower shape made of soft, flexible material. It is mounted on a sturdy stick, making it easy to hold and play with. This toy is perfect for children aged 3 and up, providing a playful way to relieve stress and engage in sensory play.",
        "quantity": 5,
        "price": 1000,
        "sku": "2BA9088E"
    },
    {
        "name": "Video Walkie Talkie",
        "slug": "video-walkie-talkie",
        "brand": null,
        "category": "educational",
        "type": "toy",
        "short_description": "A fun video walkie talkie set designed for children to enhance communication and play.",
        "description": "This Video Walkie Talkie set features two colorful devices, one blue and one pink, each with a screen displaying friendly characters. The packaging showcases children enjoying the toy, emphasizing social interaction and fun. Ideal for outdoor play, it encourages kids to communicate and explore together.",
        "quantity": 5,
        "price": 1000,
        "sku": "40CA19A6"
    },
    {
        "name": "Rainbow Art Set",
        "slug": "rainbow-art-set",
        "brand": "Happy Zone",
        "category": "arts",
        "type": "art set",
        "short_description": "A colorful art set perfect for creative kids aged 6 and up.",
        "description": "This Rainbow Art Set includes 23 pieces, featuring a vibrant rainbow design on a canvas. It comes with various art supplies such as colored markers, drawing sheets, and an easel, encouraging creativity and artistic expression in children.",
        "quantity": 5,
        "price": 1000,
        "sku": "551D465A"
    },
    {
        "name": "Rock Crawler Off-Road Vehicle",
        "slug": "rock-crawler-off-road-vehicle",
        "brand": "SHUANGFENG",
        "category": "outdoor",
        "type": "vehicle",
        "short_description": "A robust off-road vehicle designed for adventure enthusiasts.",
        "description": "This Rock Crawler features a striking red and black design with oversized tires, perfect for navigating rough terrains. Made from die-cast metal, it boasts a durable body and includes advanced features like high-strength shock absorbers and a USB Type-C charging port. Ideal for outdoor play, this vehicle is built to withstand rugged conditions.",
        "quantity": 5,
        "price": 1000,
        "sku": "F49243B4"
    }
];

const seedJSONProducts = async () => {
    try {
        for (const product of newProducts) {
            const queryText = `
                INSERT INTO products (name, sku, slug, description, short_description, category, price, quantity, brand)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
                product.quantity,
                product.brand === "null" ? null : product.brand,
            ];
            await query(queryText, values);
        }
        logger.info('✅ New JSON products seeded successfully');
        process.exit(0);
    } catch (err) {
        logger.error('❌ Error seeding json products', err);
        process.exit(1);
    }
};

seedJSONProducts();
