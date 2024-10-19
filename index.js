
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');
const userRoutes=require('./routes/user')

const cors = require('cors');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(express.json());
console.log('Mongo URI:', process.env.MONGO_URI); // For debugging

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});
io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle message sending
    socket.on('sendMessage', async (messageData) => {
        const message = new Message(messageData);
        await message.save();
        io.emit('receiveMessage', message); // Emit the message to all clients
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users',userRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});