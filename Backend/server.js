const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Add this line


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes


mongoose.connect('mongodb://localhost/codeeditor', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const User = mongoose.model('User', {
    username: String,
    password: String,
});

// Secret key for JWT
const secretKey = '3q8rujq390rfnweoigh3w094tgfnweoignqe09';

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
};

// Register route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashedPassword,
    });

    await user.save();
    res.status(201).send('User registered successfully!');
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).send('User not found');
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).send('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, secretKey);

    res.json({ token });
});

// Protected route example
app.get('/protected', authenticateJWT, (req, res) => {
    res.send(`Hello, ${req.user.username}! This is a protected route.`);
});




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
