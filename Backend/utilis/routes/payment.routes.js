import express from 'express'
import { createRazorpayOrder, verifyRazorpayPayment } from '../controller/payment.js'
const paymentRouter = express.Router()
paymentRouter.post("/create",createRazorpayOrder)
paymentRouter.post("/verify",verifyRazorpayPayment)
export default paymentRouter