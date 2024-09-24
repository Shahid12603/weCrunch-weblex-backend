require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1/weCrunch';
const authRoutes = require('./routes/auth');
const PORT = 5000;
const app = express();

// Load JWT_SECRET from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors()); 
app.use(express.json()); // Parse incoming JSON data

// Connect to MongoDB
mongoose.connect(url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});
// .then(() => console.log("MongoDB connected"))
// .catch((err) => console.log("MongoDB connection error:", err));

//Another way of checking db connection checking

const con = mongoose.connection;

con.on('open', () => {
    console.log("Connected to Database");
})

// Routes
app.use('/api/auth', authRoutes);

// Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
