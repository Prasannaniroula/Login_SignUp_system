import jwt from "jsonwebtoken";
import "dotenv/config";

const userAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized. Login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    // Attach safely to req
    req.userId = decoded.id;  // ✅ Use this in your controllers

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
};

export default userAuth;
