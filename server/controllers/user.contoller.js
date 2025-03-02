import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { fullname, username, password, email } = req.body;
    if (!fullname || !username || !password || !email) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      email,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      message: "Internal Server Error - " + error.message,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and Password are required",
        success: false,
      });
    }

    const sanitizedusername = String(username).trim();
    const sanitizedPassword = String(password).trim();
    let user = await User.findOne({ username: sanitizedusername });

    if (!user) {
      return res.status(400).json({
        message: "Username not found",
        success: false,
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      sanitizedPassword,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Incorrect Password",
        success: false,
      });
    }

    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is missing in environment variables");
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userResponse = {
      userName: user.username,
      email: user.email,
      name: user.fullname,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Welcome Back!!",
        user: userResponse,
        success: true,
      });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      message: "Something went wrong - " + error.message,
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token", { httpOnly: true, sameSite: "strict" })
      .json({
        message: "Logged out Successfully",
        success: true,
      });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      message: "Internal Server Error - " + error.message,
      success: false,
    });
  }
};
