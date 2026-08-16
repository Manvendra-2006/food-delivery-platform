import 'dotenv/config'
import app from "./app.js";
import { connectDb } from './config/db.js';
connectDb()
app.listen(1000,()=>{
    console.log(`Auth Server is running on port ${process.env.PORT}`)
})