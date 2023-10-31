const Questions = require("../models/Questions");
const UserQuestions = require("../models/UserQuestions");
const topicMapping = require("../projectData/topicData");


// ======================= EXPLORE TOPICS =======================
const getExploreTopics = async (req, res) => {
    try {
        // request
        const { id } = req.query;

        if (!id) {
            return res.status(404).json({ data: "Id is required", error: true });
        }

        // data from db
        const questions = await Questions.find();
        const userQuestions = await UserQuestions.find({ userId: id });

        const solvedQuestionIds = new Set(
            userQuestions.map((solved) => solved.questionId)
        );


        const finalData = new Map();

        questions.forEach(({ topicName, _id }) => {
            if (finalData.has(topicName)) {
                const topicInfo = finalData.get(topicName);
                topicInfo.total += 1;

                if (solvedQuestionIds.has(_id.toString()))
                    topicInfo.solved += 1;

            } else {
                const newTopicInfo = { solved: 0, total: 1, title: topicMapping[topicName], urlTitle: topicName, };
                if (solvedQuestionIds.has(_id.toString()))
                    newTopicInfo.solved += 1;

                finalData.set(topicName, newTopicInfo);
            }
        });

        exploreData = Array.from(finalData.values());
        exploreData.sort((a, b) => a.title.localeCompare(b.title));

        // response data
        const response = {
            data: exploreData,
            onGoingTopic: {
                data: "arrays",
                onGoingTopic: true,
            },
        };

        return res.status(200).json({ data: response, error: false });


    } catch (err) {
        console.log(err);
        return res.status(500).json({ data: "Something Went Wrong!", error: true });
    }
};


// ======================== SELECTED TOPIC ==========================
const getSelectedTopics = async (req, res) => {
    try {
        // request
        const { id, topic } = req.query;

        const questions = await Questions.find({ topicName: topic });
        const userQuestions = await UserQuestions.find({ userId: id, topicName: topic });

        let easyArr = [];
        let mediumArr = [];
        let hardArr = [];


        questions.forEach(({ _id, questionName, platform, level, questionUrl }) => {
            const findUserCompletedQues = userQuestions.find(item => item.questionId === _id);
            let completed = findUserCompletedQues !== undefined;

            const formattedData = {
                completed,
                id: _id,
                name: questionName,
                platform: platform,
                level: level,
                url: questionUrl
            };
            if (level === "easy") {
                easyArr.push(formattedData)
            }
            else if (level === "medium") {
                mediumArr.push(formattedData)
            }
            else if (level === "hard") {
                hardArr.push(formattedData)
            }

        });
        const selectedTopicData = [{ "body": easyArr, "cardTitle": "Easy", "cardType": "easy" },
        { "body": mediumArr, "cardTitle": "Medium", "cardType": "medium" },
        { "body": hardArr, "cardTitle": "Hard", "cardType": "hard" }];

        // response
        return res.status(200).json({ data: selectedTopicData, error: false });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ data: "Something Went Wrong!", error: true });
    }
};



// Add Questions (admin only)
const addQuestion = async (req, res) => {
    try {
        const { questionUrl } = req.body;
        const questionUrlExists = await Questions.findOne({ questionUrl: questionUrl });
        if (!questionUrlExists) {
            const newQuestion = new Questions(req.body);
            await newQuestion.save();
            return res.status(200).json("Question successfully added");
        } else {
            return res.status(409).json("Question already exists");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};



// ======================= MARK QUESTION =========================
const markQuestion = async (req, res) => {
    try {
        // request body
        const { user_id, question_id, topic } = req.body;

        // check a user's question in UserQuestions db
        const userQuestionExists = await UserQuestions.findOne({ userId: user_id, questionId: question_id, topicName: topic });

        // mark question and send response
        if (!userQuestionExists) {
            const markedQuestion = new UserQuestions({ userId: user_id, questionId: question_id, topicName: topic, date: new Date() });
            await markedQuestion.save();
            return res.status(200).json({ data: "Marked", error: false });
        }
        // unmark/delete question from db
        await UserQuestions.deleteOne(userQuestionExists);

        // response message
        return res.status(200).json({ data: "Question unmarked successfully", error: true });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ data: "Something went wrong", error: true });
    }
};


module.exports = { getExploreTopics, getSelectedTopics, addQuestion, markQuestion };