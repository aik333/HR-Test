const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
const crypto = require('crypto'); // For password hashing
dotenv.config()
const SECRET_KEY = process.env.JWT_SECRET;

const router = express.Router();

// Signup (POST)
router.post('/signup', async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'email already exists' });
        const newUser = new User({ name, email });
        newUser.setPassword(password); // Hash password before saving
        const savedUser = await newUser.save();

        // Generate JWT upon successful signup
        const token = jwt.sign({ userId: savedUser._id }, SECRET_KEY, { expiresIn: '1h' }); // Replace '1h' with your desired token expiration time

        res.json({ message: 'User created successfully', user: { name: savedUser.name, id: savedUser._id }, token }); // Send token and user in the response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login (POST)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });


        const isMatch = user.validPassword(password); // Verify password
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        // Generate JWT upon successful login
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

        res.json({
            message: 'Login successful', user: { name: user.name, id: user._id }, token // Send token and user in the response
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in' });
    }
});

module.exports = router;