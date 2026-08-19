import express from 'express'
import { addAddress, DeleteAddress, FetchAddress } from '../controllers/address.controller.js'
import { AuthMiddleware } from '../middleware/auth.middleware.js'
const addressRouter = express.Router()
addressRouter.post("/create-address",AuthMiddleware,addAddress)
addressRouter.get('/fetch-address',AuthMiddleware,FetchAddress)
addressRouter.delete("/delete-address/:addressId",AuthMiddleware,DeleteAddress)
export default addressRouter