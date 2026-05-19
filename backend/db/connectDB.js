import mongoose from "mongoose";

// connectDB function to connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the connection URL from environment variables
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");
        
    } catch (error) {
        console.log(`Error in connecting DB: ${error}`);
        process.exit(1);
    }
}

export default connectDB;