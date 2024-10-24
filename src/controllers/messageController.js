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
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit)

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
        const pipeLine = [
            // Converted find method to this
            { $match: query },

            // Used facet to query multiple times with same data of this stage
            {
                $facet: {

                    metaData: [{ $count: 'totalCount' }],
                    data: [
                        {
                            // Used bellow method instead of sort
                            $sort: { createdAt: sortOrder === 'desc' ? -1 : 1 },

                        },
                        { $skip: (pageNum - 1) * limitNum },

                        { $limit: limitNum },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'sender',
                                foreignField: '_id',
                                as: 'sender',
                                pipeline: [
                                    {
                                        $project: {
                                            name: 1,
                                            email: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'receiver',
                                foreignField: '_id',
                                as: 'receiver',
                                pipeline: [
                                    {
                                        $project: {
                                            name: 1,
                                            email: 1
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
        const [result] = await Message.aggregate(pipeLine);
        // Commented for future reference
        // const messages = await Message.find(query).sort(sort).skip((page - 1) * limit).limit(limit * 1).populate('sender', 'name email').populate('receiver', 'name email');
        // const count = await Messages.countDocument(query)

        const totalCount = result?.metaData?.[0].totalCount || 0;

        res.status(200).json({
            limit: limitNum,
            success: true,
            data: result.data,
            totalPages: Math.ceil(totalCount / limitNum),
            currentPage: pageNum * 1,
            totalCount,
        })
    } catch (error) {
        console.error('Error in getting message: ', error)
        res.status(400).json({ success: false, error: error.message })
    }
}