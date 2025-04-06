import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBIT_HOST;
const RABBITMQ_EXCHANGE = "user_event";
const RABBITMQ_ROUTING_KEY = "user.created";

export async function userCreatedEvent(user) {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBIT_HOST,
      port: 5672,
      username: process.env.RABBIT_USER,
      password: process.env.RABBIT_PASS,
    });
    const channel = await connection.createChannel();

    const exchange = "user_event";
    const queue = "user_created_queue";
    const routingKey = "user.created";

    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    // Publicar el evento
    const message = JSON.stringify(user);
    channel.publish(
      RABBITMQ_EXCHANGE,
      RABBITMQ_ROUTING_KEY,
      Buffer.from(message)
    );

    console.log(
      `[x] exchange "${RABBITMQ_EXCHANGE}", routing key "${RABBITMQ_ROUTING_KEY}": ${message}`
    );

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error al conectar o publicar en RabbitMQ:", error.message);
    // Continuar sin interrumpir el flujo
  }
}