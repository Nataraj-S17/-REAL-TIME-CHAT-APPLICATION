const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store connected users
const connectedUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user joining
  socket.on('user_join', (userData) => {
    connectedUsers.set(socket.id, userData);
    console.log(`User ${userData.username} joined`);
    
    // Broadcast to all clients that a user joined
    socket.broadcast.emit('user_joined', {
      username: userData.username,
      timestamp: new Date().toISOString()
    });
  });

  // Handle incoming messages
  socket.on('message', (messageData) => {
    console.log('Message received:', messageData);
    
    // Add server timestamp
    const messageWithTimestamp = {
      ...messageData,
      serverTimestamp: new Date().toISOString()
    };
    
    // Broadcast message to all connected clients except sender
    socket.broadcast.emit('message', messageWithTimestamp);
    
    // Log reply information if it's a reply
    if (messageData.replyTo) {
      console.log(`Reply from ${messageData.username} to ${messageData.replyTo.username}`);
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`User ${user.username} disconnected`);
      connectedUsers.delete(socket.id);
      
      // Broadcast to all clients that a user left
      socket.broadcast.emit('user_left', {
        username: user.username,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.broadcast.emit('user_typing', data);
  });

  socket.on('stop_typing', (data) => {
    socket.broadcast.emit('user_stop_typing', data);
  });
});

// API endpoint to get connected users
app.get('/api/users', (req, res) => {
  const users = Array.from(connectedUsers.values());
  res.json(users);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
