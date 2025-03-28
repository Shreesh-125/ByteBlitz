import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];  
  
    if (!token) {
      return res.status(401).json({
        message: "User is not authenticated",
        success: false,
      });
    }

    let decode;
    try {
      decode = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
        success: false,
      });
    }

    req.id = decode.userId;
   
    const urlParts = req.originalUrl.split("/");
    const versionIndex = urlParts.indexOf("v1");
    const role =
      versionIndex !== -1 && urlParts.length > versionIndex + 1
        ? urlParts[versionIndex + 1]
        : null;

    if (!["user", "admin", "blog", "problem", "contest"].includes(role)) {
      return res.status(400).json({
        message: "Invalid user role in route",
        success: false,
      });
    }

    if (role === "user") {
      const user = await User.findById(req.id).lean();
      if (!user) {
        return res.status(403).json({
          message: "Access forbidden",
          success: false,
        });
      }
    } else if (role === "admin") {
      const admin = await Admin.findById(req.id).lean();
      if (!admin) {
        return res.status(403).json({
          message: "Access forbidden",
          success: false,
        });
      }
    }

    next();
  } catch (error) {
    
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export default isAuthenticated;
