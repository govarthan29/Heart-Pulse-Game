import User from "../../models/userModel.js";

// Add Coins Controller
export const addCoins = async (req, res) => {
    try {
        const { email, coinsToAdd} = req.body;

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.coins = (user.coins || 0) + coinsToAdd;        
        
        // Save the updated user data in the database
        await user.save();

        res.status(200).json({
            message: "Coins updated successfully",
            User: {
                userName: user.userName,
                email: user.email,
                coins: user.coins
            }
        });
    } catch (error) {
        console.error(`Error in addCoinsAndScore controller: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
};