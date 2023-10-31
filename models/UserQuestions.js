const uuid = require("uuid");
const mongoose = require("mongoose");

// Schema that stores questions solved by a user

const userQuestionsSchema = new mongoose.Schema(
    {
        _id: {
            type: 'String',
            default: () => uuid.v4(),
        },
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
            default: () => Date(),
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('UserQuestions', userQuestionsSchema);