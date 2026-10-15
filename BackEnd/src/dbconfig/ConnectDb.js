import mongoose from "mongoose"

 export const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI is required to connect to the database");
    }

    await mongoose.connect(uri);
    console.log("MongoDB connection established");
}

