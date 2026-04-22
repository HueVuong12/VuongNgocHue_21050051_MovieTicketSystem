const express = require('express');
const { connectRabbit } = require('../common/rabbitmq');
const app = express();
app.use(express.json());

app.post('/booking', async (req, res) => {
    const { userId, movieId, seatNo } = req.body;
    const { channel } = await connectRabbit();

    const booking = { bookingId: Date.now(), userId, movieId, seatNo };
    // Phát event BOOKING_CREATED
    channel.publish('movie_events', 'booking.created', Buffer.from(JSON.stringify(booking)));

    res.json({ message: "Booking created, waiting for payment...", bookingId: booking.bookingId });
});

app.listen(3002, () => console.log("🎫 Booking Service: Port 3002"));   