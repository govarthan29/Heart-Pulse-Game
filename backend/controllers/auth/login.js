import User from "../../models/userModel.js";  
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken.js";

// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

         // Find user by email
        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate and send token on successful login
        generateToken(foundUser._id, res);
        res.status(200).json({
            message: "Successfully logged in",
            User: {
                userName: foundUser.userName,
                email: foundUser.email,
            },
            // Send token for authentication
            token: generateToken(foundUser._id, res)
        });

    } catch (error) {
        console.error(`Error in login controller: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
};