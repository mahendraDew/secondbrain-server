import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

const connectDB = async() => {
    try {
        if(!process.env.MONGODB_URI){
            throw new Error("MONGODB_URI is not defined in the environment variables.")
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (e: any) {
        console.error(e.message);
        process.exit(1); // Exit process if connection fails
    }
}


export default connectDB;