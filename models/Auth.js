const uuid = require("uuid");
const mongoose = require("mongoose");

// Schema to store the user credentials

const userAuthSchema = new mongoose.Schema (
    {
        _id: {
            type: String,
            default: () => uuid.v4(),
        },
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 3,
            max: 20
        },
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model("Users", userAuthSchema);