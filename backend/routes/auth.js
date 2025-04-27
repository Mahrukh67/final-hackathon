import express from "express";
import { User } from "../models/user.js";  // Make sure you export User correctly in the user model
import bcrypt from "bcrypt";
import Joi from "joi";

const router = express.Router();


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send({ message: "Invalid email or password" });

        // Compare entered password with stored hash
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send({ message: "Invalid email or password" });

        // Generate JWT token
        const token = user.generateAuthToken();
        res.send({ message: "Logged in successfully", token });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});


const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

export default router;
