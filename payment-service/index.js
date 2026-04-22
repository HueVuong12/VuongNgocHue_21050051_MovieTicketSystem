const { connectRabbit } = require('../common/rabbitmq');

async function startPayment() {
    const { channel } = await connectRabbit();
    const q = await channel.assertQueue('payment_queue');
    await channel.bindQueue(q.queue, 'movie_events', 'booking.created');

    console.log("💳 Payment Service đang đợi đơn hàng...");

    channel.consume(q.queue, (msg) => {
        const booking = JSON.parse(msg.content.toString());
        console.log("-> Đang thanh toán cho đơn:", booking.bookingId);

        // Giả lập thành công
        const success = { bookingId: booking.bookingId, status: 'PAID' };
        channel.publish('movie_events', 'payment.completed', Buffer.from(JSON.stringify(success)));
        
        channel.ack(msg);
    });
}

startPayment();