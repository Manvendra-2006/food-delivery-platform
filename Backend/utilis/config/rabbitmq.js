import amqp from "amqplib"
let channel;
export async function connectRabbitMQ(){

    const connection = await amqp.connect(
        process.env.RABBIT_MQ_URL
    )

    channel = await connection.createChannel()

    await channel.assertQueue(
        process.env.PAYMENT_QUEUE,
        {
            durable:true
        }
    )

    console.log(" 🐇Connected to RabbitMQ")
}

export function getChannel(){
    return channel
}