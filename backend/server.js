import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import connectDB from "./db/connectDB.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allow frontend requests
app.use(cookieParser());

app.use("/api/auth", authRoute);

connectDB(); // Connect to MongoDB before starting the server

app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});
