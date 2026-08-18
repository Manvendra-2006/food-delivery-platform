import express from 'express'
import { AddMenu, AddRestaurant, DeleteDish, DishUpdated, FetchAccount, GetMenu, GetRestaurantMenu, getNearbyRestaurant, SingleDishFetch, SingleFetchRestaurant, UpdateRestaurant } from '../controllers/restaurant.controller.js'
import { AuthMiddleware } from '../middleware/auth.middleware.js'
import uploadFile from '../middleware/multerMiddleware.js'
const restaurantRouter = express.Router()
restaurantRouter.post("/created",AuthMiddleware,uploadFile,AddRestaurant)
restaurantRouter.get("/my-restaurant",AuthMiddleware,FetchAccount)
restaurantRouter.put("/update",AuthMiddleware,UpdateRestaurant)
restaurantRouter.post("/create",AuthMiddleware,uploadFile,AddMenu)
restaurantRouter.get("/my-menu",AuthMiddleware,GetMenu) // this is for seller 
restaurantRouter.get("/restaurant-menu/:id",AuthMiddleware,GetRestaurantMenu) // This is for user 
restaurantRouter.get("/single-menu/:id",AuthMiddleware,SingleDishFetch)
restaurantRouter.put("/single-dish-update/:id",AuthMiddleware,DishUpdated)
restaurantRouter.delete("/delete-dish/:id",DeleteDish)
restaurantRouter.get("/restaurant-data/:id",AuthMiddleware,SingleFetchRestaurant)
restaurantRouter.get("/restaurant-near",AuthMiddleware,getNearbyRestaurant)
export default restaurantRouter