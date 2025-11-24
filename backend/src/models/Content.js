const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        jobId: { type: String, unique: true },
        prompt: { type: String, required: true },
        contentType: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "processing", "completed", "failed"],
            default: "pending"
        },
        generatedText: { type: String },
        error: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);