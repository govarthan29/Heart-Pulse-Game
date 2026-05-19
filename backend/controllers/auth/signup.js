import User from "../../models/userModel.js";  
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken.js";

// Signup Controller
export const signup = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

          // Check if user already exists with the provided email
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "Already Existing User Email" });
        }

        // Check if password meets minimum length requirement
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must have at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            userName,
            email,
            password: hashedPassword
            
        });

        // Save the user to the database and generate a token
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({ 
                message: "User created successfully",
                User: {
                    userName: newUser.userName,
                    email: newUser.email
                }
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.error(`Error in signup controller: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
};
