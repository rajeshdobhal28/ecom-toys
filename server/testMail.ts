import dotenv from 'dotenv';
dotenv.config();

import { sendOrderConfirmationEmail } from './src/services/emailService';

async function runTest() {
    const email = process.env.SMTP_USER;
    if (!email) {
        console.error('No SMTP_USER found in .env');
        process.exit(1);
    }

    console.log('Sending test email to ' + email + ' using host ' + process.env.SMTP_HOST);

    await sendOrderConfirmationEmail(
        email,
        'Rajesh Test',
        'TEST-999',
        [
            { name: 'Awesome Toy Tractor', quantity: 1, price: 499.00 }
        ],
        499.00
    );

    console.log('Test function finished (check logs above).');
    setTimeout(() => process.exit(0), 1000);
}

runTest();
