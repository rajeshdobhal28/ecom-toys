import nodemailer from 'nodemailer';
import logger from '../utils/logger';
import config from '../config';

// Create a transporter. For production, you'd use a real SMTP service (SendGrid, AWS SES, Gmail, etc.)
// If no credentials are provided in .env, we'll create a testing account using Ethereal Email.
let transporter: nodemailer.Transporter | null = null;

const initTransporter = async () => {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        logger.info('SMTP Transporter initialized from environment variables.');
    } else {
        // Fallback to ethereal for testing/demo purposes if no real SMTP is provided
        logger.info('No SMTP credentials found in environment. Generating Ethereal test account...');
        try {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });
            logger.info('Ethereal test account created for email sending.');
        } catch (err) {
            logger.error('Failed to create Ethereal test account', err);
        }
    }
};

interface OrderEmailItem {
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

export const sendOrderConfirmationEmail = async (
    toEmail: string,
    userName: string,
    orderId: string, // We can just use the first order's ID or group them. Wait, user gets multiple orders if multiple products are bought.
    items: OrderEmailItem[],
    totalAmount: number
) => {
    if (!transporter) {
        await initTransporter();
    }

    if (!transporter) {
        logger.error('Cannot send email: Transporter is not initialized.');
        return;
    }

    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; vertical-align: middle; margin-right: 12px;" />` : ''}
                <span style="font-weight: 600; color: #333;">${item.name}</span>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #555;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; color: #333; font-weight: 600;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 0;">
            <tr>
                <td align="center">
                    <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); padding: 30px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">Ecom Toys</h1>
                                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Order Confirmation</p>
                            </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="color: #333; margin-top: 0; font-size: 20px;">Hi ${userName},</h2>
                                <p style="color: #666; font-size: 16px; line-height: 1.6;">Thank you for your order! We're getting your items ready for shipment. Here are the details of your recent purchase.</p>
                                
                                <div style="margin: 30px 0; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <thead>
                                            <tr>
                                                <th style="background-color: #f8f9fa; padding: 12px; text-align: left; color: #555; font-size: 14px; border-bottom: 2px solid #eee;">Item</th>
                                                <th style="background-color: #f8f9fa; padding: 12px; text-align: center; color: #555; font-size: 14px; border-bottom: 2px solid #eee;">Qty</th>
                                                <th style="background-color: #f8f9fa; padding: 12px; text-align: right; color: #555; font-size: 14px; border-bottom: 2px solid #eee;">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${itemsHtml}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colspan="2" style="padding: 15px 12px; text-align: right; font-weight: bold; color: #333; font-size: 16px;">Total Amount:</td>
                                                <td style="padding: 15px 12px; text-align: right; font-weight: bold; color: #FF6B6B; font-size: 18px;">₹${totalAmount.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                
                                <div style="text-align: center; margin-top: 40px;">
                                    <a href="${config.clientUrl}/orders" style="display: inline-block; background-color: #FF6B6B; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">View Your Orders</a>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #fafbfc; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                                <p style="color: #888; font-size: 14px; margin: 0;">If you have any questions, reply to this email or contact our support team.</p>
                                <p style="color: #aaa; font-size: 12px; margin: 10px 0 0 0;">&copy; ${new Date().getFullYear()} Ecom Toys. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    try {
        const info = await transporter.sendMail({
            from: '"Ecom Toys" <noreply@ecomtoys.com>',
            to: toEmail,
            subject: 'Your Order Confirmation - Ecom Toys',
            html: htmlBody,
        });

        logger.info(`Order confirmation email sent to ${toEmail}. Message ID: ${info.messageId}`);

        // If it's a test ethereal account, log the preview URL
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            logger.info(`📧 Email Preview URL: ${previewUrl}`);
        }
    } catch (err) {
        logger.error(`Error sending email to ${toEmail}`, err);
    }
};

export const sendContactEmail = async (
    name: string,
    email: string,
    subject: string,
    message: string
) => {
    if (!transporter) {
        await initTransporter();
    }

    if (!transporter) {
        logger.error('Cannot send email: Transporter is not initialized.');
        return;
    }

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <tr>
                <td style="background-color: #74B9FF; padding: 20px; text-align: center;">
                    <h2 style="color: #ffffff; margin: 0;">New Contact Submission</h2>
                </td>
            </tr>
            <tr>
                <td style="padding: 30px;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #74B9FF; margin-top: 20px;">
                        <p style="margin: 0; white-space: pre-wrap; color: #333;">${message}</p>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    try {
        const info = await transporter.sendMail({
            from: '"Ecom Toys Contact" <noreply@ecomtoys.com>',
            to: 'rkdobhal.business@gmail.com',
            replyTo: email,
            subject: `Contact Form: ${subject}`,
            html: htmlBody,
        });

        logger.info(`Contact email sent. Message ID: ${info.messageId}`);
    } catch (err) {
        logger.error('Error sending contact email', err);
        throw err;
    }
};
