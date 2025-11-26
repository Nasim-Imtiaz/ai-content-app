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
        methods: ["GET", "POST"]
    }
});

setSocketIO(io);

const userSockets = new Map();

io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token ||
        socket.handshake.query && socket.handshake.query.token;
    if (!token) return next(new Error("No token provided"));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "OPTIMIZELYTOKEN");
        socket.userId = decoded.id;
        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
});

io.on("connection", (socket) => {
    const userId = socket.userId;
    if (!userId) return;
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socket.id);
    console.log("Socket connected:", socket.id, "for user", userId);

    socket.on("disconnect", () => {
        const set = userSockets.get(userId);
        if (set) {
            set.delete(socket.id);
            if (set.size === 0) userSockets.delete(userId);
        }
        console.log("Socket disconnected:", socket.id);
    });
});

function emitJobUpdateToUser(userId, payload) {
    const sockets = userSockets.get(userId);
    if (!sockets) return;
    for (const socketId of sockets) {
        io.to(socketId).emit("jobUpdate", payload);
    }
}

setEmitFunction(emitJobUpdateToUser);

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

export default emitJobUpdateToUser;