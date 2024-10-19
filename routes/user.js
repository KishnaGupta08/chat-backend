const express = require('express');
const User = require('../models/user');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
router.get('/',verifyToken, async (req, res) => {
    try {
      const users = await User.find(); // Fetch all users from the database
      res.status(200).json(users); // Send the users as JSON response
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  });
  
  module.exports = router;