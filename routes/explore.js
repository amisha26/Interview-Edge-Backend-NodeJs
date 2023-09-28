const router = require("express").Router();
const Questions = require("../models/Questions");

// Add Questions (admin only)
router.post("/add-questions", async (req, res) => {
    try {
        const {topicName, questionUrl, questionName, level, platform} = req.body;
        const questionUrlExists = await Questions.findOne({questionUrl: questionUrl});
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


module.exports = router;