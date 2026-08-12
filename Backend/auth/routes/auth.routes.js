import express from 'express'
import { AccountDetails, loginController, RoleController } from '../controller/user.controller.js'
const authRouter = express.Router()
authRouter.post("/login",loginController)
authRouter.put("/role",RoleController)
authRouter.get("/account",AccountDetails)
export default authRouter