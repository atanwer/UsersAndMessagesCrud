import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Message content is required.'],
        trim: true,
        minLength: [1, 'Message cannot be empty'],
        maxLength: [1000, 'Message cannot exceed 1000 characters']
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'sender is required.']
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'receiver is required.']
    }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema)