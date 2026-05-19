import User from "../../models/userModel.js";

// Get User Data Controller
export const userData = async (req, res) => {
    const { email } = req.body;

  try {
    // Find user by email in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      User: {
        userName: user.userName,
        email: user.email,
        coins: user.coins
      }
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }

};

