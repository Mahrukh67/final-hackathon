import mongoose from 'mongoose';

// Ensure you're using the environment variable for the MongoDB URI
const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;
    if (!dbURI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }
    await mongoose.connect(dbURI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Could not connect database!", error);
    process.exit(1);  // Exits the process if the database connection fails
  }
};

export default connectDB;
