import mongoose from "mongoose";

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

export default mongoose.model("Content", contentSchema);