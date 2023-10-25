const mongoose = require("mongoose");

const userAuthSchema = new mongoose.Schema (
    {
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