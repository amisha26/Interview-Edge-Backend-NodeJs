const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema (
    {
        questionUrl: {
            type: String,
            required: true,
        },
        topicName: {
            type: String,
            required: true,
        },
        questionName: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            required: true,
        },
        platform: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Explore', questionsSchema);