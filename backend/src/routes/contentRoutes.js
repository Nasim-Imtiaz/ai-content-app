import express from "express";
import Content from "../models/Content.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { enqueueContentJob } from "../queue/queue.js";

const router = express.Router();

router.post("/generate-content", authMiddleware, async (req, res) => {
    try {
        const { prompt, contentType } = req.body;
        if (!prompt || !contentType) {
            return res.status(400).json({ message: "prompt and contentType required" });
        }

        // Create Content record in DB with status pending
        const content = await Content.create({
            user: req.user.id,
            prompt,
            contentType,
            status: "pending"
        });

        const { jobId, delayMs } = await enqueueContentJob({
            userId: req.user.id,
            prompt,
            contentType,
            contentId: content._id.toString()
        });

        content.jobId = jobId.toString();
        await content.save();

        return res
            .status(202)
            .json({
                message: "Job queued",
                jobId, delayMs,
                contentId: content._id,
                content
            });
    } catch (err) {
        console.error("enqueue error", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/content/:jobId/status", authMiddleware, async (req, res) => {
    try {
        const { jobId } = req.params;
        const content = await Content.findOne({
            jobId,
            user: req.user.id
        });

        if (!content) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json({
            status: content.status,
            generatedText: content.generatedText,
            prompt: content.prompt,
            contentType: content.contentType,
            error: content.error
        });
    } catch (err) {
        console.error("status error", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/content", authMiddleware, async (req, res) => {
    const contents = await Content.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.json(contents);
});

router.put("/content/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { prompt, contentType, generatedText } = req.body;

        const content = await Content.findOne({ _id: id, user: req.user.id });

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        // Update only provided fields
        if (prompt !== undefined) {
            content.prompt = prompt;
        }
        if (contentType !== undefined) {
            content.contentType = contentType;
        }
        if (generatedText !== undefined) {
            content.generatedText = generatedText;
        }

        await content.save();

        res.json({
            message: "Content updated",
            content
        });
    } catch (err) {
        console.error("update content error", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/content/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    await Content.deleteOne({ _id: id, user: req.user.id });
    res.json({ message: "Deleted" });
});

export default router;
