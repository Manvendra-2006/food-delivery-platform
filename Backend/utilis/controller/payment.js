import axios from "axios"
import { razorpay } from "../config/razorpay.js"
import { verifyRazorpaySignature } from "../config/verifyRazorpay.js"
import { publishPaymentSuccess } from "../config/payment.producer.js"
export async function createRazorpayOrder(req,resp){
    try{
        const {orderId} = req.body
        const {data}  = await axios.get(`http://localhost:2000/api/order/get-order/payment/${orderId}`,{
            headers:{
                "x-internal-key":process.env.INTERNAL_SERVICE_KEY
            }
        })

        const razorpayOrder = await razorpay.orders.create({
            amount:data.amount ,
            currency:"INR",
            receipt:orderId
        })
        return resp.status(200).json({razorpayOrderId:razorpayOrder.id,
                key:process.env.RAZORPAY_SECRET_KEY
        })
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

export async function verifyRazorpayPayment(req,resp){
    try{
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature,orderId} = req.body
        const isValid = verifyRazorpaySignature(razorpay_order_id,razorpay_payment_id,razorpay_signature)
        if(!isValid){
            return resp.status(400).json({message:"Payment verification failed"})
        }
        await publishPaymentSuccess({orderId,paymentId,provider:"razorpay"})
        resp.json({message:"Payment Verified Successfully"})
    }
    catch(error){
     return resp.status(500).json({message:"Internal Server Error",error:error.message})
    }
}