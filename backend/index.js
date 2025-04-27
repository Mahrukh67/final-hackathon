import express from "express";
import cors from "cors";
import connection from "./db.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import dotenv from 'dotenv';
dotenv.config();  

const app = express();

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 4008;
app.listen(port, () => console.log(`Listening on port ${port}...`));