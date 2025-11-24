import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", contentRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/ai_content";

async function start() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");

        app.get("/", (req, res) => res.send("Backend running"));
        app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
    } catch (err) {
        console.error("Startup error", err);
        process.exit(1);
    }
}

start();
