import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required.'],
        trim: true,
        minLength: [2, 'name must be atleast two characters.'],
        maxLength: [50, 'name cannot exceed 50 characters.'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required.'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    age: {
        type: Number,
        required: true,
        min: [0, 'age cannot be negative.'],
        max: [150, 'age cannot exceed 150']
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required.']
    }
}, {
    timestamps: true
})

export default mongoose.model("User", userSchema);