// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import taskRoutes from "./routes/task.route.js";  // Import the task routes

// const app = express();
// app.use(cors());
// app.use(express.json()); // To parse JSON requests

// // Use Task routes
// app.use("/api", taskRoutes);

// // MongoDB connection
// mongoose.connect("mongodb://localhost:27017/mini-task-tracker", { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log("MongoDB Connected"))
//     .catch((err) => console.log(err));

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRouter from './routes/task.route.js'; 

// Load environment variables from .env file
dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/* Define routes */
app.use('/api/tasks', taskRouter); 

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
