import crypto from 'crypto'

export const verifyRazorpaySignature = (
    orderId,
    paymentId,
    signature
)=>{
    const body = `${orderId}|${paymentId}`
    const exprectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET_KEY).update(body).digest("hex")
    return exprectedSignature === signature
}
