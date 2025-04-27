import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import config from "../config.js";
import { Add } from "../models/add.model.js";


// signup function code
export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // server side validation using zod
    const userSchema = z.object({
        firstName: z.string().min(3, { message: "firstName must be atleast 3 char long" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "password must be atleast 6 char long" }),

    });
    const validatedData = userSchema.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json({ errors: validatedData.error.issues.map((err) => err.message) });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ errors: "User already exists" });
        }
        const newUser = new User({ firstName, lastName, email, password: hashedPassword, });
        await newUser.save();
        res.status(201).json({ message: "Signup successfully", newUser });

    } catch (error) {
        res.status(500).json({ errors: "Error in signup" });
        console.log("Error in signup", error);
    }

};


// login function code
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email: email });
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!user || !isPasswordCorrect) {
            return res.status(403).json({ errors: "Invalid credentials" });
        }

        // jwt code here 
        const token = jwt.sign(
            {
                id: user._id,
            },
            config.JWT_USER_PASSWORD,
            { expiresIn: "1d" }
        );
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true, // cant be accessed via js directly
            secure: process.env.NODE_ENV === "production", //true for https only
            sameSite: "Strict", //CSRF attacks se bachaeyga
        };

        res.cookie("jwt", token, cookieOptions);
        res.status(201).json({ message: "Login successful", user, token });

    } catch (error) {
        res.status(500).json({ errors: "Error in login" });
        console.log("Error in login", error);
    }
};


// // logout code /bs cookies ko clear krna hai 
// export const logout = (req, res) => {
//     try {
//         if(!req.cookies.jwt){
//          return res.status(401).json({ errors: "Kindly login first" });
//         }

//         res.clearCookie("jwt");
//         res.status(200).json({ message: "Logged out successfully" });
//     } catch (error) {
//         res.status(500).json({ errors: "Error in logout" });
//         console.log("Error in logout", error);
//     }
// };

export const logout = (req, res) => {
    try {
      res.clearCookie("jwt");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ errors: "Error in logout" });
      console.log("Error in logout", error);
    }
  };

// export const logout = (req, res) => {
//     try {
//         if (!req.cookies.jwt) {
//             return res.status(401).json({ errors: "Kindly login first" });
//         }

//         res.clearCookie("jwt", {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "Strict",
//         });
//         res.status(200).json({ message: "Logged out successfully" });
//     } catch (error) {
//         console.log("Error in logout", error);
//         res.status(500).json({ errors: "Error in logout" });
//     }
// };




// get all purchased courses here function code
export const add = async (req, res) => {
    const userId = req.userId;

    try {
        const purchased = await Add.find({ userId });
        let addTaskId = [];
        for (let i = 0; i < add.length; i++) {
            addTaskId.push(add[i].taskId);
        }

        const taskData = await Task.find({
            _id: { $in: addTaskId },
        });

        res.status(200).json({ add, taskData});
    } catch (error) {
        res.status(500).json({ errors: "Error in adds" });
        console.log("Error in add", error);
    }

};

