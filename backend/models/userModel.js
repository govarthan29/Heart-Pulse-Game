import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true // Ensure that each user has a unique userName
    },

    email: {
        type: String,
        required: true,
        unique: true // Ensure that each user has a unique email address
    },

    password: {
        type: String,
        required: true,
        minLength: 8 // Enforce minimum length of 8 for passwords
    },

    coins: {
        type: Number,
        default: 0
    }
});

const user = mongoose.model("user", UserSchema);

export default user;
