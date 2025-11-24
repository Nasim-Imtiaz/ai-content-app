import Bull from "bull";
import dotenv from "dotenv";
dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://redis:6379";

export const contentQueue = new Bull("content-generation", redisUrl);

export async function enqueueContentJob({ userId, prompt, contentType, contentId }) {
    const delayMs = 60000; // 1 minute

    const job = await contentQueue.add(
        {
            userId,
            prompt,
            contentType,
            contentId
        },
        {
            delay: delayMs,
            attempts: 3
        }
    );

    return { jobId: job.id, delayMs };
}