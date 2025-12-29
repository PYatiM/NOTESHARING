require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
// const router = require('./router'); // Uncomment if you actually use this
const app = express();

// 1. Create the HTTP server
const server = http.createServer(app);

// 2. Attach Socket.io to the SERVER, not the port
const io = require("socket.io")(server, {
  cors: {
    // This connects to your Frontend on Vercel
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  console.log("User added:", userId, "->", socketId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected.");

  // take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    
    // Safety check: Make sure user is online before sending
    if (user) {
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    } else {
        console.log(`User ${receiverId} not found/offline`);
    }
  });

  // when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// 3. Simple health check route (Good for Render to know it's alive)
app.get('/', (req, res) => {
    res.send('Socket Server is Running');
});

// 4. Start the server
const PORT = process.env.PORT || 8900;
server.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`);
});