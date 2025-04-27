import express from "express";
import { User, validate } from "../models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config(); // VERY IMPORTANT for using process.env

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Validate incoming data
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
      return res
        .status(409)
        .send({ message: "User with given email already exists!" });

    // Create hashed password
    const saltRounds = Number(process.env.SALT) || 10; // Default 10 if not set
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user and save
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;

