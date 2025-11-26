import express from "express";
import Content from "../models/Content.js";
import emitJobUpdateToUser from "../server.js";

const router = express.Router();

router.post("/jobs/:jobId/notify", async (req, res) => {
    try {
        console.log("hi");
        const { jobId } = req.params;
        const content = await Content.findOne({ jobId });
        if (!content) {
            return res.status(404).json({ message: "Job not found" });
        }

        emitJobUpdateToUser(String(content.user), content);

        return res.json({ message: "Notification sent" });
    } catch (err) {
        console.error("notify error", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
