const router = require("express").Router();
const {userSignup, userLogin} = require("../controllers/auth.controller");

// USER SIGNUP
router.post("/signup", userSignup);


// USER LOGIN
router.post("/login", userLogin);


module.exports = router;