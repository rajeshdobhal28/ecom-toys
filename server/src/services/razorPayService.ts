const Razorpay = require("razorpay");
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.PAYMENT_API_KEY,
    key_secret: process.env.PAYMENT_API_SECRET,
});

export const createRazorPayOrder = async (amount: number, receipt: string) => {
    try {
        const response = await razorpay.orders.create({
            amount: Math.round(amount * 100), // in paise
            currency: 'INR',
            receipt,
        })
        return response;
    } catch (err) {
        return null;
    }
}

export const verifyRazorPayPaymentSignature = (orderId: string, paymentId: string, signature: string) => {
    const expected = crypto.createHmac('sha256', process.env.PAYMENT_API_SECRET!).update(`${orderId}|${paymentId}`).digest('hex');
    return expected == signature;
}