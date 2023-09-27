const router = require("express").Router();
const Auth = require("../models/Auth");

router.post("/signup", async (req, res) => {
    try {
        const existingUser = await Auth.findOne({ username: req.body.username });

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

router.post("/login", async (req, res) => {
    try {
        
    } catch (err) {
        return res.status(500).json(err);
    }
});


module.exports = router;