const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Sign-up route
router.post('/signup', async (req, res) => {
    const { username, phone, email, password } = req.body;

    // Simple validation
    if (!username || !phone || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ username, phone, email, password });
    try {
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            token,
            username,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
        token,
        username: user.username,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
});

// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving user' });
    }
});

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving users' });
    }
});

// DELETE user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// DELETE all users
router.delete('/', async (req, res) => {
    try {
        await User.deleteMany(); // Delete all users
        res.status(200).json({ message: 'All users deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting users' });
    }
});

module.exports = router;
