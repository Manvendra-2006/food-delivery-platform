import 'dotenv/config'
import app from "./app.js";
import { connectRabbitMQ } from './config/rabbitmq.js';
connectRabbitMQ()
app.listen(process.env.PORT,()=>{
    console.log(`Utilis Server is running on port ${process.env.PORT} `)
})