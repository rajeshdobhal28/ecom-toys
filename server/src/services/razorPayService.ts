const Razorpay = require("razorpay");
import crypto from 'crypto';
import config from '../config';

const razorpay = new Razorpay({
    key_id: config.paymentApiKey,
    key_secret: config.paymentApiSecret,
});

export const createRazorPayOrder = async (amount: number, receipt: string) => {
    // Errors propagate so the caller can surface a real failure instead of
    // crashing on a null order (previously swallowed and returned null). The
    // raw gateway response is not logged here — it is noise at best and can
    // leak request details into logs.
    const resp = await razorpay.orders.create({
        amount: Math.round(amount * 100), // in paise
        currency: 'INR',
        receipt,
    });
    return resp;
}

export const verifyRazorPayPaymentSignature = (orderId: string, paymentId: string, signature: string) => {
    const expected = crypto
        .createHmac('sha256', config.paymentApiSecret)
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
