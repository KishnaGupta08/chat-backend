const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body; // Include email here
    
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { username, email, password } = req.body; // Accept email as well

    try {
        // Check user by username or email
        const user = await User.findOne({ 
            $or: [{ username }, { email }] 
        });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create a token
        const status="success"
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ status,token, userId: user._id });
    } catch (error) {
        const status="failed"
        res.status(500).json({ status,message: error.message });
    }
});

module.exports = router;
