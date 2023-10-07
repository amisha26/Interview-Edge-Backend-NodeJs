const router = require("express").Router();
const Questions = require("../models/Questions");
const UserQuestions = require("../models/UserQuestions");
const topicMapping = require("../projData/topicData");


// formattedData = {"title": title_name, "urlTitle": urltitle, "total": total, "solved": solved}
//GET TOPICS
router.get("/topics/:id", async (req, res) => {
    try {
        const question = await Questions.find();
        countTitle = {};
        question.forEach((item) => {
            val = item.topicName;
            countTitle = {...countTitle, [val]: countTitle[val] === undefined ? 1 : countTitle[val] + 1};
        });
        const userQuestion  = await UserQuestions.find();
        solvedTopics = {};
        userQuestion.forEach((item) => {
            val = item.topicName;
            id = item.userId;
            if (id === req.params.id) {
                solvedTopics = {...solvedTopicsss, [val]: solvedTopics[val] === undefined ? 1 : solvedTopics[val] + 1}
            }
        });
        finalData =  Object.keys(countTitle).map((item) => {
            urlTitle = item;
            total = countTitle[item]
            if (urlTitle in topicMapping) {
                title = topicMapping[urlTitle];
            }
            if (urlTitle in solvedTopics) {
                solved = solvedTopics[urlTitle];
            }
            else{
                solved = 0;
            }
            return {"title": title, "urlTitle": urlTitle, "total": total, "solved": solved};
        });
        return res.status(200).json(finalData);

    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});  


// GET SELECTED TOPICS
router.get("/selected_topic/:id/:topic", async (req, res) => {
    try {
        const {id, topic} = req.params;
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
                const findUserCompletedQues = userQues.filter ((i) => {
                    return i.userId === id && i.questionId === qId;
                });
                if (findUserCompletedQues.length > 0) {
                    completed = "True";
                } else {
                    completed = "False";
                }
                formattedData = {"completed": completed, "questionId": qId, "name": qName, "platform": platform, "level": level}
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
        selectedTopicData = [{"body": easyArr, "cardTitle": "Easy", "cardType": "easy"}, 
        {"body": mediumArr, "cardTitle": "Medium", "cardType": "medium"},
        {"body": hardArr, "cardTitle": "Hard", "cardType": "hard"}];
        return res.status(200).json(selectedTopicData);

    } catch (err) {
        console.log(err);
        return res.status(409).json(err);
    }
});



// Add Questions (admin only)
router.post("/add-questions", async (req, res) => {
    try {
        const questionUrlExists = await Questions.findOne({questionUrl: req.body.questionUrl});
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
        const {userId, questionId, topicName} = req.body;
        const userQuestionExists = await UserQuestions.findOne({userId: userId, questionId: questionId, topicName: topicName});
        // MARK QUESTION
        if (!userQuestionExists) {
            const currentDate = new Date();
            const markedQuestion = new UserQuestions({userId: userId, questionId: questionId, topicName: topicName, date: currentDate});
            await markedQuestion.save();
            return res.status(200).json("Question has been marked");
        }
        // UNMARK QUESTION
        await UserQuestions.deleteOne(userQuestionExists);
        return res.status(200).json("Question un-marked");
        
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});


module.exports = router;