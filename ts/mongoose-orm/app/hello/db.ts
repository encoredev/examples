import mongoose from "mongoose";
// import { UserModel } from "./entities/cat.entity";
import  { Schema, Document } from "mongoose";



const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: "mydb",
        });

        // return  UserModel

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};


