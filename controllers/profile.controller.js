const Questions = require("../models/Questions");
const UserQuestions = require("../models/UserQuestions");
const mockData = require("../projectData/mockApiData/dummy")


// ======================= GET USER STATUS =======================
const userStatus = async (req, res) => {
    try {
        // request
        const { id } = req.query;

        const questions = await Questions.find();
        const userQuestions = await UserQuestions.find({userId: id});

        let easyTotal = 0;
        let mediumTotal = 0;
        let hardTotal = 0;
        questions.forEach(({level}) => {
            if (level === "easy") {
                easyTotal += 1;
            } else if (level === "medium") {
                mediumTotal += 1;
            } else if (level === "hard") {
                hardTotal += 1;
            }
        });
        let easySolved = 0;
        let mediumSolved = 0;
        let hardSolved = 0;

        userQuestions.forEach(({questionId}) => {
            const selectedQuestion = questions.filter(({id}) => id === questionId)
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

        // response data
        return res.status(200).json({ data: finalData, error: false });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ data: "Something Went Wrong!", error: true });
    }
};


// GET DROP-DOWN DATA
const dropdownData = async (req, res) => {
    try {
        res.status(200).json({ data: mockData.dropdown, error: false });
    } catch (err) {
        console.log(err);
        res.status(500).json({ data: "Something Went Wrong!", error: true });
    }
};


// GET TABLE DATA
const tableData = async (req, res) => {
    try {
        const { id } = req.query;
        const questions = await Questions.find();
        const userQuestions = await UserQuestions.find({userId: id});
        questionData = [];
        questionData = questions.map((question) => {
            const {level, platform, questionName: qName, topicName: qTopic, questionUrl: url, id: qId} = question;
            
            const fetchUserDetails = userQuestions.filter((id) => id.questionId === qId);
            console.log(fetchUserDetails.date, fetchUserDetails)
            if (fetchUserDetails.length > 0) {
                date = fetchUserDetails.date;
                done = "Yes";
            } else {
                date = null;
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
};


module.exports = {userStatus, dropdownData, tableData};