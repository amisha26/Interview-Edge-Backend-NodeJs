const router = require("express").Router();
const Questions = require("../models/Questions");
const UserQuestions = require("../models/UserQuestions");


// formattedData = {"title": title_name, "urlTitle": urltitle, "total": total, "solved": solved}
// TO-DO:
// get title from questions table,
// get urlTitle from topic mapping,
// get total questions per topic from question
// get the count of questions solved per topic from userquestions table
//GET TOPICS
router.get("/topics/:id", async (req, res) => {
    try {
        const question = await Questions.find();
        const uniqueTitle = new Set();
        question.forEach((item) => {
            uniqueTitle.add(item.topicName);
        });
        const title = [...uniqueTitle];
        console.log(title);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});  

// GET SELECTED TOPICS


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