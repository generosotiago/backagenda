const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 4,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Basic",
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false, 
    },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
