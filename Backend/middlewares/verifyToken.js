import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Blacklist from "../models/blacklist.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("🔍 Incoming Token:", token.slice(0, 30) + "...");
    
    const blacklisted = await Blacklist.findOne({ token });
    if (blacklisted) return res.status(401).json({ message: "Token expired or invalid" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
