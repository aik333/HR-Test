const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const employeeRoutes = require('./routes/employeeRoutes');
const userRoutes = require('./routes/userRoutes');
const authorize = require('./middleWare/authorize')

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

const app = express();

app.use(cors());
app.use(express.json()); // Parse incoming JSON data

// User Routes
app.use('/user', userRoutes);

// Employee Routes
app.use('/employees', authorize, employeeRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error' });
});

const port = process.env.PORT || 3000; // Setting port from environment variable

app.listen(port, () => console.log(`Server listening on port ${port}`));
