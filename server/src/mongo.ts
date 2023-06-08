import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
// MongoDB connection URL
const connectionString = process.env.MONGODB_ATLAS_CONNECTION_STRING;
const dbName = process.env.DB_NAME;
export const connectDB = async () => {
    try {
        await mongoose.connect(connectionString, { dbName });
        console.log("Connected to MongoDB Atlas");
    }
    catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
    }
};