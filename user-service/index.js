const express = require('express');
const { connectRabbit } = require('../common/rabbitmq');
const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
    const { username, email } = req.body;
    const { channel } = await connectRabbit();
    
    const userEvent = { username, email, type: 'USER_REGISTERED' };
    channel.publish('movie_events', 'user.registered', Buffer.from(JSON.stringify(userEvent)));
    
    res.json({ message: "User registered event sent!", user: username });
});

app.listen(3001, () => console.log("👤 User Service: Port 3001"));