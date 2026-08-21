import 'dotenv/config'
import app from "./app.js";
import { connectDb } from "./config/db.js";
import { connectRabbitMQ } from './config/rabbitmq.js';
import { startPaymentConsumer } from './config/consumer.js';
connectDb()
await connectRabbitMQ()
startPaymentConsumer()
app.listen(process.env.PORT,()=>{
    console.log(`Restaurant Server is running on port ${process.env.PORT} `)
})