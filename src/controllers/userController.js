import User from "../models/user.js";

export const createUser = async (req, res) => {
    try {
        const { name, email, dob, age } = req.body;
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({ success: false, message: "User already exist with this email" })
        }
        const user = await User.create({ name, email, dob, age });
        res.status(201).json({ success: true, message: "User created successfully", data: user })
    } catch (error) {
        console.error('Error in user creation: ', error)
        res.status(400).json({ success: false, error: error.message })
    }
}


export const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, name, dob, age, sortOrder = 'desc' } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const query = {};

        if (name) {
            query.name = { $regex: name, $options: "i" }
        }

        if (age) {
            query.age = parseInt(age);
        }

        if (dob) {
            query.dob = new Date(dob);
        }

        const pipeline = [
            { $match: query },
            {
                $facet: {
                    metaData: [{ $count: "totalCount" }],
                    data: [{ $sort: { createdAt: sortOrder === 'desc' ? -1 : 1 } },
                    { $skip: (pageNum - 1) * limitNum },
                    { $limit: limitNum }]
                }
            }


        ];
        console.log({ pipeline })
        const [result] = await User.aggregate(pipeline);

        // Format response to match original structure
        const totalCount = result?.metaData?.[0].totalCount || 0;

        res.status(200).json({
            limit: limitNum,
            success: true,
            data: result.data,
            totalPages: Math.ceil(totalCount / limitNum),
            currentPage: pageNum,
            totalCount
        })
    } catch (error) {
        console.error('Error in getting all users: ', error)
        res.status(400).json({ success: false, error: error.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." })
        }

        res.status(200).json({ success: true, message: "User Updated Successfully", user })
    } catch (error) {
        console.error("Error in updating user", error);
        res.status(400).json({ success: false, message: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." })
        }

        res.status(200).json({ success: true, message: "User Deleted Successfully" })
    } catch (error) {
        console.error("Error in deleting user", error);
        res.status(400).json({ success: false, message: error.message })
    }
}