const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173", // Update with your frontend URL
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

app.use(cors());

// Map to store code sessions
const codeSessions = new Map();

io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);

    socket.on('join-session', (sessionId) => {
        socket.join(sessionId);
        console.log(`User ${socket.id} joined session ${sessionId}`);
        io.to(sessionId).emit('user-joined', { userId: socket.id });
    });

    socket.on('code-change', (data) => {
        const { sessionId, newCode } = data;
        io.to(sessionId).emit('update-code', { socketId: socket.id, newCode });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

app.post('/generate-session', (req, res) => {
    const sessionId = uuidv4();
    codeSessions.set(sessionId, true);
    res.json({ sessionId });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
