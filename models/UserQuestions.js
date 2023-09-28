const mongoose = require("mongoose");

// # CREATE TABLE IF NOT EXISTS userQuestions (
//     # userQuestions_id TEXT PRIMARY KEY,
//     # user_id TEXT NOT NULL,
//     # question_id text NOT NULL,
//     # topic_name VARCHAR(50) NOT NULL,
//     # date DATE NOT NULL
//     # )

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