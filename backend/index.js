import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

// Import Routes
import useRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import noteroute from './routes/notes.js';
import commentroute from './routes/comment.js';
import conversationroute from './routes/conversation.js';
import messageroute from './routes/message.js';

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// 1. Database Connection (Use MONGO_URL from your .env)
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => console.log("DB Error:", err));

// 2. Middleware (MUST come before routes)
// Allow your Vercel Frontend to talk to this Backend
app.use(cors({
  origin: process.env.CLIENT_URL || "*", // ideally put your Vercel URL here in .env
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization', 'sessionId'],
  credentials: true
}));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// 3. Static Files (This is how the other guy got /images)
// Make sure you have a folder named 'public/images' inside your backend folder!
const __dirname = path.resolve();
app.use("/images", express.static(path.join(__dirname, "public/images")));

// 4. Routes
app.use('/api/users', useRoute);
app.use('/api/auth', authRoute);
app.use('/api/notes', noteroute);
app.use('/api/comments', commentroute);
app.use('/api/conversations', conversationroute);
app.use('/api/messages', messageroute);

// Simple test route
app.get("/", (req, res) => {
    res.send("Backend is running!");
})

// 5. Start Server (Only ONCE)
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});