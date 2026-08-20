import express from 'express'
import cors from 'cors'
import restaurantRouter from './routes/restaurantRoutes.js'
import addressRouter from './routes/addressRoutes.js'
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/restaurant",restaurantRouter)
app.use("/api/address",addressRouter)
export default app