import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Bull from "bull";
import { generateContentFromAI } from "./services/aiService.js";
import Content from "./models/Content.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/ai_content";
const redisUrl = process.env.REDIS_URL || "redis://redis:6379";

async function start() {
    await mongoose.connect(MONGO_URI);
    console.log("[Worker] Mongo connected");

    const contentQueue = new Bull("content-generation", redisUrl);

    contentQueue.process(async (job) => {
        const { contentId, prompt, contentType } = job.data;
        console.log("[Worker] Processing job", job.id);

        const content = await Content.findById(contentId);
        if (!content) {
            throw new Error("Content record not found");
        }

        content.status = "processing";
        await content.save();

        try {
            const generatedText = await generateContentFromAI({ prompt, contentType });

            content.status = "completed";
            content.generatedText = generatedText;
            content.error = undefined;
            await content.save();

            console.log("[Worker] Job completed", job.id);
            return true;
        } catch (err) {
            console.error("[Worker] Job failed", job.id, err);
            content.status = "failed";
            content.error = err.message;
            await content.save();
            throw err;
        }
    });

    console.log("[Worker] Waiting for jobs...");
}

start().catch((e) => {
    console.error("Worker startup error", e);
    process.exit(1);
});
