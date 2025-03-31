import mongoose from "mongoose";

const unreadMessageSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        count: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const UnreadMessage = mongoose.model("UnreadMessage", unreadMessageSchema);
export default UnreadMessage;
