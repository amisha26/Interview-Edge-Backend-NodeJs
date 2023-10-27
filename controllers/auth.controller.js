const Auth = require("../models/Auth");


// ========================= USER SIGNUP ===========================
const userSignup =  async (req, res) => {
    try {
        // Get user input
        const { username, password } = req.body;

        // validate username and password
        if (username.length === 0) {
            return res.status(400).json({ message: "username cannot be empty", error: true })
        }

        if (password.length === 0) {
            return res.status(400).json({ message: "password cannot be empty", error: true })
        }

        if (!(username.length >= 3 && username.length <= 20))
            return res.status(400).json({ message: "Username length is invalid", error: true });


        if (!(password.length >= 3 && password.length <= 20))
            return res.status(400).json({ message: "Password length is invalid", error: true });


        const existingUser = await Auth.findOne({ username: username, password: password });

        if (!existingUser) {
            const newUser = new Auth(req.body);
            await newUser.save();
            return res.status(200).json({
                message: "User signup successful",
                data: { id: existingUser._id, name: username, token: 1234 },
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
        // Get user input
        const { username, password } = req.body;
        const existingUser = await Auth.findOne({ username: username, password: password });

        if (!existingUser)
            return res.status(404).json({ message: "Invalid Credentials", error: true });

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