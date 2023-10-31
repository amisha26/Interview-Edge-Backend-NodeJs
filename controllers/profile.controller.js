const Questions = require("../models/Questions");
const UserQuestions = require("../models/UserQuestions");
const mockData = require("../projectData/mockApiData/dummy");
const topicMapping = require("../projectData/topicData");


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
        // response data
        res.status(200).json({ data: mockData.dropdown, error: false });
    } catch (err) {
        console.log(err);
        res.status(500).json({ data: "Something Went Wrong!", error: true });
    }
};


// GET TABLE DATA
const tableData = async (req, res) => {
    try {
        // request 
        const { id } = req.query;

        if (!id) 
            return res.status(400).json({data: "ID is required", error: true});
        
        // data from db
        const questions = await Questions.find();
        const userQuestions = await UserQuestions.find({userId: id});

        const solvedQuestionIds = new Set(userQuestions.map((solved) => solved.questionId));

        // convert solvedQuestions to map of id to date-time
        const solvedQuestionDateTimeMap = {};
        userQuestions.forEach(({ questionId, date}) => {
            solvedQuestionDateTimeMap[questionId] = date;
        })

        const checkDateTimeInMap = (id) => {
            if (id in solvedQuestionDateTimeMap)
                return solvedQuestionDateTimeMap[id];
            return null;
        };

        const finalData = questions.map(
            ({ questionUrl, topicName, level, questionName, _id }) => (
                {
                    date: checkDateTimeInMap(_id),
                    done: solvedQuestionIds.has(_id.toString()) ? "Yes" : "No",
                    url: questionUrl,
                    topic: topicMapping[topicName],
                    level,
                    question: questionName,
                }
            )
        );
        finalData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // response data
        return res.status(200).json({ data: {"rows": finalData}, error: false });

    } catch (err) {
        console.log(err);
        res.status(500).json({ data: "Something Went Wrong!", error: true });
    }
};


module.exports = {userStatus, dropdownData, tableData};