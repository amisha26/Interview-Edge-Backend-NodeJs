const Auth = require("../models/Auth");
const bcrypt = require("bcrypt");


function getInvalidResponses(message) {
    return res.status(400).json({ message, error: true })
}

// ========================= USER SIGNUP ===========================
const userSignup =  async (req, res) => {
    try {
        // request body
        const { username, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // check user in db
        const existingUser = await Auth.findOne({ username: username });

        // if user does not exists send response
        if (!existingUser) {
            const newUser = new Auth({
                username: username,
                password: hashedPassword, // Store the hashed password in the database
            });
            await newUser.save();
            return res.status(200).json({
                message: "User signup successful",
                data: { id: newUser._id, name: username, token: 1234 },
                error: false,
              });
        }
        return res.status(409).json({ message: "User already exists. Login instead.", error: true });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: true });
    }
};



// ========================== USER LOGIN ============================
const userLogin = async (req, res) => {
    try {
        // request body
        const { username, password } = req.body;

        // check user in db
        const existingUser = await Auth.findOne({ username: username });
        if (!existingUser) {
            return getInvalidResponses("Invalid Credentials");
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return getInvalidResponses("Invalid Credentials");
        }

        return res.status(200).json({
            message: "Login successful",
            data: { id: existingUser._id, name: username, token: 1234 },
            error: false,
        });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: true });
    }
};


module.exports = {userSignup, userLogin};