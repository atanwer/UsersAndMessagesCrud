import Message from "../models/message.js";
import User from "../models/user.js";

export const createMessages = async (req, res) => {

    try {
        // For the time being we are sending sender details from request body but if user is loged in then we need to get id from request object

        const { content, senderId, receiverId } = req.body

        const sender = await User.findById(senderId);

        if (!sender) {
            return res.status(400).json({ success: false, message: "sender not exist." })
        }
        const receiver = await User.findById(receiverId);

        if (!receiver) {
            return res.status(400).json({ success: false, message: "receiver not exist." })
        }

        const message = await Message.create({ content, sender: senderId, receiver: receiverId })

        res.status(200).json({ success: true, message: "Message sent successfully", data: message })
    } catch (error) {
        console.log("Error in message sending: ", error);
        res.status(400).json({ status: false, message: error.message })
    }

}

export const editMessages = async (req, res) => {

    try {
        // For the time being we are sending sender details from request body but if user is loged in then we need to get id from request object
        const messageId = req.params.id;
        const { content, senderId } = req.body
        const message = await Message.findOne({ _id: messageId, sender: senderId })
        if (!message) {
            return res.status(400).json({ success: false, message: "Message not found or user not authorized to update this message" })
        }

        message.content = content;

        await message.save();

        res.status(200).json({ success: true, message: "Message edited successfully", data: message })
    } catch (error) {
        console.log("Error in message editing: ", error);
        res.status(400).json({ status: false, message: error.message })
    }

}

export const deleteMessages = async (req, res) => {

    try {
        // For the time being we are sending sender details from request body but if user is loged in then we need to get id from request object
        const messageId = req.params.id;
        const { senderId } = req.body
        const message = await Message.findOneAndDelete({ _id: messageId, sender: senderId })
        if (!message) {
            return res.status(400).json({ success: false, message: "Message not found or user not authorized to delete this message" })
        }

        res.status(200).json({ success: true, message: "Message deleted successfully", data: message })
    } catch (error) {
        console.log("Error in message deleting: ", error);
        res.status(400).json({ status: false, message: error.message })
    }

}

export const getMessages = async (req, res) => {
    try {
        const { page = 1, limit = 10, content, senderId, receiverId, sortOrder = 'desc' } = req.query;
        const query = {};

        if (content) {
            query.content = { $regex: content, $options: "i" }
        }

        if (senderId) {
            query.sender = senderId;
        }

        if (receiverId) {
            query.receiver = receiverId;
        }

        const sort = {
            'createdAt': sortOrder === 'desc' ? -1 : 1
        }

        const messages = await Message.find(query).populate('sender', 'name email').populate('receiver', 'name email').sort(sort).limit(limit * 1).skip((page - 1) * limit);
        const count = await Message.countDocuments(query);
        res.status(200).json({
            limit,
            success: true,
            data: messages,
            totalPages: Math.ceil(count / limit),
            currentPage: page * 1,
            totalCount: count
        })
    } catch (error) {
        console.error('Error in getting message: ', error)
        res.status(400).json({ success: false, error: error.message })
    }
}