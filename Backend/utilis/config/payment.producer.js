import { getChannel } from "./rabbitmq.js"

export async function publishPaymentSuccess({
    orderId,
    paymentId,
    provider
}){

    const channel = getChannel()

    channel.sendToQueue(
        process.env.PAYMENT_QUEUE,

        Buffer.from(
            JSON.stringify({
                type:"PAYMENT_SUCCESS",

                data:{
                    orderId,
                    paymentId,
                    provider
                }
            })
        ),

        {
            persistent:true
        }
    )
}