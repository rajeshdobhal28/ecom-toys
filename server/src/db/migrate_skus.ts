import pool from './index';
import logger from '../utils/logger';

const products = [
    { id: '5d5c660a-e1a6-478a-a8f7-950b41b2fa79', sku: 'EDU-DOM-FTD' }, // Educational, Domino, Funny Train Domino Set
    { id: '782319eb-c968-4206-bfe3-ed8e50021ce0', sku: 'OUT-GEN-MSR' }, // Outdoor, General, M82A1 Sniper Rifle
    { id: 'acb795e1-bad6-44ce-9886-139cc1016b05', sku: 'EDU-GEN-LCW' }, // Educational, General, Colorful LCD Writing Tablet
    { id: '491fdcf4-3e5c-4a99-8931-fdd677f249b8', sku: 'EDU-STU-ILB' }, // Educational, Study Book, Interactive Learning Book
    { id: '386db92e-e7bb-4a20-8b24-283de959c33f', sku: 'EDU-MYH-LCD' }, // Educational, MY HOME, Little Chef Dream Coffee Machine
    { id: '2eb200fa-f6b9-4982-b4dd-f77af3d1418d', sku: 'EDU-PLA-IBP' }, // Educational, Play & Smile, Intelligent Baby Phone
    { id: 'f0fd8a36-65e8-45a2-855b-1e38ca933c27', sku: 'EDU-DIT-MBB' }, // Educational, Ditfun Toys, Magnetic Bar Blocks
    { id: '42d5bdc4-58c4-4101-9133-ecbdb6ee6d1e', sku: 'SOF-GEN-PSN' }, // Softtoys, General, Panda Silicone Night Light
    { id: '6aae4a9a-ede0-41d5-b380-d0cf0fc9bc54', sku: 'OUT-SHU-RCO' }, // Outdoor, SHUANGFENG, Rock Crawler Off-Road Vehicle
    { id: '7ed9e58e-73e2-4813-a128-e1858c0883cd', sku: 'EDU-PEP-IPT' }, // Educational, Peppa Pig, Interactive Peppa Pig Toy
    { id: 'cceaab70-2f68-405d-85d2-57a39c3fbce4', sku: 'EDU-GEN-CFS' }, // Educational, General, Candy Flower Stress Buster
    { id: '3703ae44-1c29-4711-8a70-abefe80c2146', sku: 'ART-HAP-RAS' }, // Arts, Happy Zone, Rainbow Art Set
    { id: '38275627-7b26-438a-9ede-244242cca138', sku: 'EDU-TOY-SHJ' }, // Educational, Toyshine, String Hockey Junior
    { id: '9dd253ac-9b44-4e47-8d36-1ceff021c14d', sku: 'EDU-GEN-VWT' }  // Educational, General, Video Walkie Talkie
];

const migrate = async () => {
    try {
        await pool.query('BEGIN');

        for (const product of products) {
            await pool.query('UPDATE products SET sku = $1 WHERE id = $2', [product.sku, product.id]);
        }

        await pool.query('COMMIT');
        logger.info('SKUs generated and updated successfully');
    } catch (err) {
        await pool.query('ROLLBACK');
        logger.error('Error migrating SKUs', err);
    } finally {
        pool.end();
    }
};

migrate();
