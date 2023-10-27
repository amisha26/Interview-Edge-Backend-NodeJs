const router = require("express").Router();
const { selectedTopicData } = require("../projectData/mockApiData/dummy");
const Questions = require("../models/Questions");
const UserQuestions = require("../models/UserQuestions");
const topicMapping = require("../projectData/topicData");


// formattedData = {"title": title_name, "urlTitle": urltitle, "total": total, "solved": solved}
//GET TOPICS
router.get("/topics", async (req, res) => {
    try {
        const { id: userId } = req.query;
        const question = await Questions.find();
        countTitle = {};
        question.forEach((item) => {
            val = item.topicName;
            countTitle = { ...countTitle, [val]: countTitle[val] === undefined ? 1 : countTitle[val] + 1 };
        });
        const userQuestion = await UserQuestions.find();
        solvedTopics = {};
        userQuestion.forEach((item) => {
            val = item.topicName;
            id = item.userId;
            if (id === userId) {
                solvedTopics = { ...solvedTopics, [val]: solvedTopics[val] === undefined ? 1 : solvedTopics[val] + 1 }
            }
        });
        finalData = Object.keys(countTitle).map((item) => {
            urlTitle = item;
            total = countTitle[item]
            if (urlTitle in topicMapping) {
                title = topicMapping[urlTitle];
            }
            if (urlTitle in solvedTopics) {
                solved = solvedTopics[urlTitle];
            }
            else {
                solved = 0;
            }
            return { "title": title, "urlTitle": urlTitle, "total": total, "solved": solved };
        });
        // response data
        const response = {
            data: finalData,
            onGoingTopic: {
                data: "arrays",
                onGoingTopic: true,
            },
        };

        return res.status(200).json({ data: response, error: false });


    } catch (err) {
        console.log(err);
        return res.status(500).json({data: "Something Went Wrong!", error: true});
    }
});


// GET SELECTED TOPICS
router.get("/selected_topic", async (req, res) => {
    try {
        const { id, topic } = req.query;
        const question = await Questions.find();
        easyArr = [];
        mediumArr = [];
        hardArr = [];
        const userQues = await UserQuestions.find();
        question.forEach((item) => {
            if (item.topicName === topic) {
                qId = item.id
                qName = item.questionName
                platform = item.platform
                level = item.level
                qUrl = item.questionUrl
                const findUserCompletedQues = userQues.filter((i) => {
                    return i.userId === id && i.questionId === qId;
                });
                if (findUserCompletedQues.length > 0) {
                    completed = true;
                } else {
                    completed = false;
                }
                formattedData = { "completed": completed, "id": qId, "name": qName, "platform": platform, "level": level, "url": qUrl}
                if (level === "easy") {
                    easyArr.push(formattedData)
                }
                else if (level === "medium") {
                    mediumArr.push(formattedData)
                }
                else if (level === "hard") {
                    hardArr.push(formattedData)
                }
            }
        });
        const selectedTopicData = [{ "body": easyArr, "cardTitle": "Easy", "cardType": "easy" },
        { "body": mediumArr, "cardTitle": "Medium", "cardType": "medium" },
        { "body": hardArr, "cardTitle": "Hard", "cardType": "hard" }];
        return res.status(200).json({ data: selectedTopicData, error: false });

    } catch (err) {
        console.log(err);
        return res.status(500).json({data: "Something Went Wrong!", error: true});
    }
});



// Add Questions (admin only)
router.post("/add-questions", async (req, res) => {
    try {
        const questionUrlExists = await Questions.findOne({ questionUrl: req.body.questionUrl });
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
});

// Mark question
router.post("/markQuestion", async (req, res) => {
    try {
        const { user_id, question_id, topic } = req.body;
        const userQuestionExists = await UserQuestions.findOne({ userId: user_id, questionId: question_id, topicName: topic });
        // MARK QUESTION
        if (!userQuestionExists) {
            const currentDate = new Date();
            const markedQuestion = new UserQuestions({ userId: user_id, questionId: question_id, topicName: topic, date: currentDate });
            await markedQuestion.save();
            return res.status(200).json({ data: "Marked", error: false });
        }
        // UNMARK QUESTION
        await UserQuestions.deleteOne(userQuestionExists);
        return res.status(200).json({ data: "Question unmarked successfully", error: true });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ data: "Something went wrong", error: true });
    }
});


module.exports = router;