import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_EXCHANGE = "user_event";
const RABBITMQ_ROUTING_KEY = "user.created";

export async function userCreatedEvent(user) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_HOST);
    const channel = await connection.createChannel();

    const exchange = RABBITMQ_EXCHANGE;
    const queue = "user_created_queue";
    const routingKey = RABBITMQ_ROUTING_KEY;

    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    // Publicar el evento
    const message = JSON.stringify(user);
    channel.publish(exchange, routingKey, Buffer.from(message));

    console.log(
      `[x] exchange "${exchange}", routing key "${routingKey}": ${message}`
    );

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error al conectar o publicar en RabbitMQ:", error.message);
    // Continuar sin interrumpir el flujo principal de la app
  }
}
