const router = require("express").Router();
const {getExploreTopics, getSelectedTopics, addQuestion, markQuestion} = require("../controllers/explore.controller");


//GET TOPICS
router.get("/topics", getExploreTopics);
        

// GET SELECTED TOPICS
router.get("/selected_topic", getSelectedTopics);


// Add Questions (admin only)
router.post("/add-questions", addQuestion);


// Mark Question
router.post("/markQuestion", markQuestion);


module.exports = router;