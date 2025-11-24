import express from "express";
import Content from "../models/Content.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

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

        return res
            .status(202)
            .json({
                message: "Content Created",
                contentId: content._id
            });
    } catch (err) {
        console.error("Content Creation error", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/content", authMiddleware, async (req, res) => {
    const contents = await Content.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(contents);
});

router.delete("/content/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    await Content.deleteOne({ _id: id, user: req.user.id });
    res.json({ message: "Deleted" });
});

export default router;
