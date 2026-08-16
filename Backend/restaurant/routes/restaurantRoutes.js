import express from 'express'
import { AddRestaurant } from '../controllers/restaurant.controller.js'
import { AuthMiddleware } from '../middleware/auth.middleware.js'
const restaurantRouter = express.Router()
restaurantRouter.post("/created",AuthMiddleware,AddRestaurant)
export default restaurantRouter