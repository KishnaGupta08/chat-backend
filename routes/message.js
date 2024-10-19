const express = require('express');
const Message = require('../models/message');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Send a message
router.post('/', verifyToken,async (req, res) => {
    const {  receiver, content } = req.body;
    const sender = req.user.id; // Get sender ID from the token

    
    try {
        const message = new Message({ sender, receiver, content });
        await message.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch messages between users (implement this later)
router.get('/:userId', verifyToken, async (req, res) => {
    const userId = req.params.userId; // User ID from the URL parameter
    const currentUserId = req.user.id; // Current user's ID from the token

    try {
        // Fetch messages between current user and the specified user
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        }).populate('sender receiver', 'username email'); // Populate sender and receiver info

        res.json(messages); // Send the messages as response
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
    }
});
router.put('/:messageId', verifyToken, async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;

    try {
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { content },
            { new: true } // return the updated document
        );

        if (!updatedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        
        res.json({ message: 'Message updated successfully', updatedMessage });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update message' });
    }
});
router.delete('/:messageId', verifyToken, async (req, res) => {
    const { messageId } = req.params;

    try {
        await Message.findByIdAndDelete(messageId);
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete message' });
    }
});

module.exports = router;
