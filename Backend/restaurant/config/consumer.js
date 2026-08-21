import Order from "../models/order.model.js";
import { getChannel } from "./rabbitmq.js";
export async function startPaymentConsumer() {
    const channel = getChannel()
    channel.consume(process.env.PAYMENT_QUEUE, async () => {
        if (!msg) return;
        try {
            const event = JSON.stringify(msg.content.toString())
            if (event.type !== "PAYMENT_SUCCESS") {
                channel.ack(msg)
                return;
            }
            const { orderId } = event.data
            const order = await Order.findOneAndUpdate({
                _id: orderId,
                paymentStatus: { $ne: "paid" }
            }, {
                $set: {
                    paymentStatus: "paid",
                    status: "placed"
                }
            },{
                $unset:{
                    expiresAt:1,
                }
            },{new:true})
            if(!order){
                channel.ack(msg)
                return ;

            }
            console.log(" ✅✅ Order PLaced",order._id)
            channel.ack(msg)
        }
        catch (error) {
            console.log("❌",error)
        }
    })
}