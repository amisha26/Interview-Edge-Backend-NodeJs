const router = require("express").Router();
const Questions = require("../models/Questions");
const UserQuestions = require("../models/UserQuestions");
const mockData = require("../mockApiData/dummy")

// GET USER STATUS
router.get("/user_status", async (req, res) => {
    try {
        const { id } = req.query;
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
            const selectedQuestion = questions.filter(({id}) => id === qId)
            selectedQuestion.forEach (({level}) => {
                if (level === "easy") {
                    easySolved += 1;
                } else if (level === "medium") {
                    mediumSolved += 1;
                } else if (level === "hard") {
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
        return res.status(200).json({ data: finalData, error: false });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ data: "Something Went Wrong!", error: true });
    }
});

// GET DROP-DOWN DATA
router.get("/dropdown-data", async (req, res) => {
    try {
        res.status(200).json({ data: mockData.dropdown, error: false });
    } catch (err) {
        console.log(err);
        res.status(500).json({ data: "Something Went Wrong!", error: true });
    }
})


// GET TABLE DATA
router.get("/table_data", async (req, res) => {
    try {
        const { id } = req.query;
        const questions = await Questions.find();
        const userQuestions = await UserQuestions.find();
        questionData = [];
        questionData = questions.map((question) => {
            level = question.level;
            platform = question.platform;
            qName = question.questionName;
            qTopic = question.topicName;
            url = question.questionUrl;
            qId = question.id;
            const fetchUserDetails = userQuestions.filter((userid) => userid.userId === id && userid.questionId === qId);
            if (fetchUserDetails.length > 0) {
                date = fetchUserDetails.date;
                done = "Yes";
            } else {
                date = "None";
                done = "No";
            }
            return {"date": date, "done": done, "level": level, "platform": platform,
            "question": qName, "topic": qTopic, "url": url};
        });
        const finalData = {"rows": questionData};
        return res.status(200).json({ data: finalData, error: false });

    } catch (err) {
        console.log(err);
        res.status(500).json({ data: "Something Went Wrong!", error: true });
    }
});


module.exports = router;