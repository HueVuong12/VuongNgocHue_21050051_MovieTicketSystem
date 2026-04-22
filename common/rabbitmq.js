const amqp = require('amqplib');

async function connectRabbit() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertExchange('movie_events', 'topic', { durable: true });
        return { connection, channel };
    } catch (error) {
        console.error("Lỗi kết nối RabbitMQ:", error);
    }
}

module.exports = { connectRabbit };