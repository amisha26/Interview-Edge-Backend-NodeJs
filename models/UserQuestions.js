const mongoose = require("mongoose");

const userQuestionsSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        questionId: {
            type: String,
            required: true,
        },
        topicName: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('UserQuestions', userQuestionsSchema);