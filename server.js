const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ACTIONS = require('./Actions');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);

app.use(cookieParser()); // Use cookie-parser middleware

app.use(
    cors({
        origin: 'http://localhost:5173', // Replace with the actual origin of your React app
        methods: ['GET', 'POST'],
    })
);
app.use(express.json());

const io = new Server(server);


mongoose.connect('mongodb://localhost/codeeditor', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const User = mongoose.model('User', {
    username: String,
    password: String,
});

const secretKey = 'aqjr0q39rjmq3irneqwrh83w';

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.authToken; // Retrieve the token from the cookie

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
const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);


        socket.broadcast.to(roomId).emit(ACTIONS.JOINED, {
            clients,
            username,
            socketId: socket.id,
        });

        // Emit to the user who just joined
        socket.emit(ACTIONS.JOINED, {
            clients,
            username,
            socketId: socket.id,
        });
    });


    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashedPassword,
    });

    await user.save();
    res.status(201).send('User registered successfully!');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ username: user.username }, secretKey);

    // Set the JWT token as a cookie
    res.cookie('authToken', token, { httpOnly: true });
    res.json({ token });
});



const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
