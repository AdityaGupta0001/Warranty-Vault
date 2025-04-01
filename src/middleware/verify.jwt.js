import jwt from "jsonwebtoken";
import { admin } from "../config/firebase.js";

const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
};

export { verifyToken };
