import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import app from "./app.js";
import * as http from "node:http";
import {Server} from "socket.io";
import { setSocketIO, setEmitFunction } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/ai_content";

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type"],
        exposedHeaders: ["Authorization"]
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000
});

setSocketIO(io);

const userSockets = new Map();

io.use((socket, next) => {
    next();
});

io.on("connection", (socket) => {
    console.log("Socket connection attempt:", socket.id);

    const token = socket.handshake.auth?.token || 
                  socket.handshake.query?.token ||
                  socket.handshake.headers?.authorization?.replace('Bearer ', '');
    
    console.log("Token present:", !!token);
    
    if (!token) {
        console.log("Socket connection rejected: No token provided");
        socket.emit("auth_error", { message: "No token provided" });
        socket.disconnect();
        return;
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "OPTIMIZELYTOKEN");
        socket.userId = decoded.id;
        console.log("Socket authenticated for user:", decoded.id);

        if (!userSockets.has(socket.userId)) {
            userSockets.set(socket.userId, new Set());
        }
        userSockets.get(socket.userId).add(socket.id);
        console.log("Socket connected:", socket.id, "for user", socket.userId);

        socket.emit("authenticated", { userId: socket.userId });
        
    } catch (err) {
        console.log("Socket authentication failed: Invalid token", err.message);
        socket.emit("auth_error", { message: "Invalid token" });
        socket.disconnect();
        return;
    }

    socket.on("disconnect", (reason) => {
        const userId = socket.userId;
        if (userId) {
            const set = userSockets.get(userId);
            if (set) {
                set.delete(socket.id);
                if (set.size === 0) userSockets.delete(userId);
            }
        }
        console.log("Socket disconnected:", socket.id, "reason:", reason);
    });

    socket.on("error", (error) => {
        console.error("Socket error for user", socket.userId, ":", error);
    });
});

function emitJobUpdateToUser(userId, payload) {
    const sockets = userSockets.get(userId);
    if (!sockets) return;
    for (const socketId of sockets) {
        io.to(socketId).emit("jobUpdate", payload);
    }
}

setEmitFunction(emitJobUpdateToUser, userSockets);

async function start() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");

        server.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
    } catch (err) {
        console.error("Startup error", err);
        process.exit(1);
    }
}

start();