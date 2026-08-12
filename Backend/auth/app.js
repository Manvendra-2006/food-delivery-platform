import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.routes.js'
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use("/api/auth",authRouter)
export default app