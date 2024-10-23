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
        const query = {};

        if (name) {
            query.name = { $regex: name, $options: "i" }
        }

        if (age) {
            query.age = age;
        }

        if (dob) {
            query.dob = new Date(dob);
        }

        const sort = {
            'createdAt': sortOrder === 'desc' ? -1 : 1
        }

        const users = await User.find(query).sort(sort).limit(limit * 1).skip((page - 1) * limit);
        const count = await User.countDocuments(query);
        res.status(200).json({
            limit,
            success: true,
            data: users,
            totalPages: Math.ceil(count / limit),
            currentPage: page * 1,
            totalCount: count
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