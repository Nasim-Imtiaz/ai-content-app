import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import * as http from "node:http";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./socket/handlers.js";
import { createEmitFunction } from "./socket/emitter.js";
import { setEmitFunction } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/ai_content";

// Create HTTP server and Socket.io instance
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

const userSockets = new Map();
io.use((socket, next) => next());
io.on("connection", setupSocketHandlers(io, userSockets));

const emitJobUpdateToUser = createEmitFunction(io, userSockets);
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