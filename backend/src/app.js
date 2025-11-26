import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import notifyRoutes from "./routes/notifyRoutes.js";

const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", contentRoutes);
app.use("/api", notifyRoutes);

export default app;


