const Razorpay = require("razorpay");
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.PAYMENT_API_KEY,
    key_secret: process.env.PAYMENT_API_SECRET,
});

export const createRazorPayOrder = async (amount: number, receipt: string) => {
    // Let errors propagate so the caller can surface a real failure instead of
    // crashing on a null order (previously swallowed and returned null).
    try {
const resp = await razorpay.orders.create({
        amount: Math.round(amount * 100), // in paise
        currency: 'INR',
        receipt,
    });
    console.log("resp---->", resp)
    return resp;
    } catch(err) {
        console.log("ERROR --->", err);
        return null;
    }
    
}

export const verifyRazorPayPaymentSignature = (orderId: string, paymentId: string, signature: string) => {
    const expected = crypto
        .createHmac('sha256', process.env.PAYMENT_API_SECRET!)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    const expectedBuf = Buffer.from(expected);
    const signatureBuf = Buffer.from(signature);

    // Length check guards timingSafeEqual (which throws on length mismatch) and
    // keeps the comparison constant-time.
    if (expectedBuf.length !== signatureBuf.length) {
        return false;
    }
    return crypto.timingSafeEqual(expectedBuf, signatureBuf);
}
