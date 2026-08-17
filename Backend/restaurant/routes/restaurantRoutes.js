import express from 'express'
import { AddMenu, AddRestaurant, DeleteDish, DishUpdated, FetchAccount, GetMenu, SingleDishFetch, UpdateRestaurant } from '../controllers/restaurant.controller.js'
import { AuthMiddleware } from '../middleware/auth.middleware.js'
import uploadFile from '../middleware/multerMiddleware.js'
const restaurantRouter = express.Router()
restaurantRouter.post("/created",AuthMiddleware,uploadFile,AddRestaurant)
restaurantRouter.get("/my-restaurant",AuthMiddleware,FetchAccount)
restaurantRouter.put("/update",AuthMiddleware,UpdateRestaurant)
restaurantRouter.post("/create",AuthMiddleware,uploadFile,AddMenu)
restaurantRouter.get("/my-menu",AuthMiddleware,GetMenu)
restaurantRouter.get("/single-menu/:id",AuthMiddleware,SingleDishFetch)
restaurantRouter.put("/single-dish-update/:id",AuthMiddleware,DishUpdated)
restaurantRouter.delete("/delete-dish/:id",DeleteDish)
export default restaurantRouter