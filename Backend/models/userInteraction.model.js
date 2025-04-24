// models/UserInteraction.js
import mongoose from "mongoose";

const userInteractionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    interactedWith: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    lastInteraction: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true });

// Create compound index for faster lookups
userInteractionSchema.index({ userId: 1, interactedWith: 1 }, { unique: true });

const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);
export default UserInteraction;