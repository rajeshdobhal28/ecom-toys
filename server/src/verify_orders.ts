import { query } from './db';
import config from './config';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch'; // Ensure node-fetch is available or use native fetch if Node version supports

// Simple logging
const log = (msg: string, data?: any) => console.log(`[VERIFY] ${msg}`, data ? JSON.stringify(data, null, 2) : '');

const runVerification = async () => {
    try {
        log('Starting verification...');

        // 1. Get a user and a product
        const userRes = await query('SELECT * FROM users LIMIT 1');
        if (userRes.rows.length === 0) {
            log('❌ No users found. Cannot create order.');
            process.exit(1);
        }
        const user = userRes.rows[0];
        log('✅ Found User:', { id: user.id, email: user.email });

        const productRes = await query('SELECT * FROM products LIMIT 1');
        if (productRes.rows.length === 0) {
            log('❌ No products found. Cannot create order.');
            process.exit(1);
        }
        const product = productRes.rows[0];
        log('✅ Found Product:', { id: product.id, name: product.name });

        // 2. Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, picture: user.picture },
            config.jwtSecret,
            { expiresIn: '1h' }
        );
        log('✅ Generated JWT Token');

        // 3. Create Order via API
        const createOrderUrl = `http://localhost:${config.port}/api/orders`;
        log(`Calling POST ${createOrderUrl}...`);

        const createRes = await fetch(createOrderUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `secureToken=\${token}`
            },
            body: JSON.stringify({
                productId: product.id,
                quantity: 1
            })
        });

        const createData: any = await createRes.json();

        if (createRes.status !== 201) {
            log('❌ Create Order Failed', createData);
            process.exit(1);
        }

        log('✅ Create Order Success', createData);
        const orderId = createData.data.id;

        // 4. Get Orders via API
        const getOrdersUrl = `http://localhost:${config.port}/api/orders`;
        log(`Calling GET ${getOrdersUrl}...`);

        const getRes = await fetch(getOrdersUrl, {
            method: 'GET',
            headers: {
                'Cookie': `secureToken=\${token}`
            }
        });

        const getData: any = await getRes.json();

        if (getRes.status !== 200) {
            log('❌ Get Orders Failed', getData);
            process.exit(1);
        }

        const foundOrder = getData.data.find((o: any) => o.id === orderId);
        if (foundOrder) {
            log('✅ Found Created Order in List', foundOrder);
        } else {
            log('❌ Created Order NOT found in List', getData.data);
            process.exit(1);
        }

        log('🎉 Verification Complete!');
        process.exit(0);

    } catch (err) {
        log('❌ Verification Error', err);
        process.exit(1);
    }
};

runVerification();
