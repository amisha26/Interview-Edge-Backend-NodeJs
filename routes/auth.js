const router = require("express").Router();
const Auth = require("../models/Auth");

// USER SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const {username, password} = req.body;

        // validate username and password
        if (!(username.length >= 3 && username.length <= 20)) {
            return res.status(400).json("Username length is invalid");
        }

        if (!(password.length >= 3 && password.length <= 20)) {
            return res.status(400).json("Password length is invalid");
        }

        const existingUser = await Auth.findOne({ username: username , password: password});
        
        if (!existingUser) {
            const newUser = new Auth(req.body);
            await newUser.save();
            return res.status(200).json("User added");
        }
        return res.status(409).json("User already exists. Login instead.");
    } catch (err) {
        return res.status(500).json(err);
    }
});

// USER LOGIN
router.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        const existingUser = await Auth.findOne({ username: username, password: password});

        if (!existingUser) {
            return res.status(404).json("You don't have an account. Signup instead.");
        }
        //fetching fields other than the one's mentioned below
        const {createdAt, updatedAt, __v, ...other} = existingUser._doc;
        return res.status(200).json(other);
    } catch (err) {
        return res.status(500).json(err);
    }
});


module.exports = router;