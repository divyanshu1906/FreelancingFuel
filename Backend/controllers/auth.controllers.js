import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import Blacklist from "../models/blacklist.model.js";

//Signup Controller
export const registerUser = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "Email already in use" });
        }

        const newUser = await User.create({
            name,
            email, 
            password,
            role, 
        });

        const { password: _, ...userWithoutPassword } = newUser._doc;

        res.status(201).json({ 
        message: "User created successfully", 
        user: userWithoutPassword 
        });

    } catch (error) {
        console.error("Error while registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Login Controller
export const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        if(!req.user){
            return res.status(404).json({ message: "User Not Found" });
        }

        const user = req.user;

        res.status(200).json({
            message: "User fetched successfully",
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const logoutUser = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "No token provided" });

    const decoded = jwt.decode(token);
    const expiry = new Date(decoded.exp * 1000);

    await Blacklist.create({ token, expiresAt: expiry });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};