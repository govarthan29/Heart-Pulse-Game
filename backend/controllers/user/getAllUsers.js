import User from "../../models/userModel.js";

// Get All Users' Names and Coins
export const getAllUsers = async (req, res) => {
  try {
      const users = await User.find({}, "userName coins");

      if (!users.length) {
          return res.status(200).json({ users: [] }); // Ensure JSON format
      }
      res.status(200).json({ users });

  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};