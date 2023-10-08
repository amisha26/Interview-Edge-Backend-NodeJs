const router = require("express").Router();
const Questions = require("../models/Questions");
const UserQuestions = require("../models/UserQuestions");
const topicMapping = require("../projData/topicData");

// const user_data = {
//     "easySolved": 2,
//     "easyTotal": 72,
//     "hardSolved": 0,
//     "hardTotal": 31,
//     "mediumSolved": 0,
//     "mediumTotal": 144,
//     "total": 247,
//     "totalSolved": 3
// }
router.get("/user_status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const questions = await Questions.find();
        const userQuestions = await UserQuestions.find();
        let easyTotal = 0;
        let mediumTotal = 0;
        let hardTotal = 0;
        questions.forEach((item) => {
            if (item.level === "easy") {
                easyTotal += 1;
            } else if (item.level === "medium") {
                mediumTotal += 1;
            } else if (item.level === "hard") {
                hardTotal += 1;
            }
        });
        let easySolved = 0;
        let mediumSolved = 0;
        let hardSolved = 0;
        const questionsSolvedByUser = userQuestions.filter((userid) => userid.userId === id);
        questionsSolvedByUser.forEach((user) => {
            qId = user.questionId
            const selectedQuestion = questions.filter((i) => i.id === qId)
            selectedQuestion.forEach ((i) => {
                if (i.level === "easy") {
                    easySolved += 1;
                } else if (i.level === "medium") {
                    mediumSolved += 1;
                } else if (i.level === "hard") {
                    hardSolved += 1;
                }
            })
        });
        total = easyTotal + mediumTotal + hardTotal
        totalSolved = easySolved + mediumSolved + hardSolved;
        const finalData = {
            "easySolved": easySolved, "easyTotal": easyTotal, "hardSolved": hardSolved,
            "hardTotal": hardTotal, "mediumSolved": mediumSolved, "mediumTotal": mediumTotal, "total": total,
            "totalSolved": totalSolved
        };
        return res.status(200).json(finalData);

    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

module.exports = router;