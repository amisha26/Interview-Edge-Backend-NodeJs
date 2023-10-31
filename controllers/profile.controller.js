const Questions = require("../models/Questions");
const UserQuestions = require("../models/UserQuestions");
const mockData = require("../projectData/mockApiData/dummy")


// ======================= GET USER STATUS ==========================
const userStatus = async (req, res) => {
    try {
        // request
        const { id } = req.query;

        if (!id)
            return res.status(400).json({data: "ID is required", error: true});

        // data from db
        const questions = await Questions.find();
        const userQuestions = await UserQuestions.find({userId: id});

        const solvedQuestionIds = new Set(userQuestions.map((solved) => solved.questionId));

        const levelMapping = {
            easy: { total: 0, solved: 0 },
            medium: { total: 0, solved: 0 },
            hard: { total: 0, solved: 0 },
        }

        let total = 0;
        let totalSolved = 0;

        questions.forEach(({ level, _id }) => {
            total += 1;
            levelMapping[level].total += 1;
            if (solvedQuestionIds.has(_id.toString())) {
                levelMapping[level].solved += 1;
                totalSolved += 1;
            }
        });

        const finalData = {
            "easySolved": levelMapping.easy.solved, "easyTotal": levelMapping.easy.total, "hardSolved": levelMapping.hard.solved,
            "hardTotal": levelMapping.hard.total, "mediumSolved": levelMapping.medium.solved, "mediumTotal": levelMapping.medium.total, "total": total,
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