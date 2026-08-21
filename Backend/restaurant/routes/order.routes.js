import express from 'express'
import { createOrder, fetchOrderForPayment } from '../controllers/order.controller.js'
import { AuthMiddleware } from '../middleware/auth.middleware.js'
const orderRouter = express.Router()
orderRouter.post("/create-order/:addressId/:restaurantId",AuthMiddleware,createOrder)
orderRouter.get("/get-order/payment/:id",fetchOrderForPayment)
export default orderRouter