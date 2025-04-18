import { Admin } from "../models/admin.model.js";
import { Blog } from "../models/blog.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Problems } from "../models/problems.model.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
        success: false,
      });
    }

    const sanitizedemail = String(email).trim();
    const sanitizedPassword = String(password).trim();
    let admin = await Admin.findOne({ email: sanitizedemail });

    if (!admin) {
      return res.status(400).json({
        message: "Email not found",
        success: false,
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      sanitizedPassword,
      admin.password
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

    const tokenData = { userId: admin._id };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const adminResponse = {
      email: admin.email,
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
        admin: adminResponse,
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

export const AdminPostBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and Content are required",
        success: false,
      });
    }

    const adminId = req.id; // Assuming req.id contains the authenticated user's ID
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        message: "admin not found",
        success: false,
      });
    }

    // Create a new blog post
    const blog = await Blog.create({
      title: title,
      content: content,
      tags: tags,
      author: adminId, // Assuming the Blog schema has an 'author' field
      authorUsername:"admin"
    });

    // Optionally, add the blog to the admin's list of blogs
    admin.blogs = admin.blogs ? [...admin.blogs, blog._id] : [blog._id];
    await admin.save();

    res.status(201).json({
      success: true,
      message: "Blog posted successfully",
      data: {
        blogId: blog._id,
        title: blog.title,
        author: admin.name,
        createdAt: blog.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const createProblem = async (req,res)=>{
  try {
    const {questionTitle,timeLimit,memoryLimit,questionDescription,sampleTestCase,rating,hidden,tags}=req.body;

    const problem= await Problems.create({
      questionTitle,timeLimit,memoryLimit,questionDescription,sampleTestCase,rating,hidden,tags
    });
    await problem.save();

    res.status(201).json({ success: true, message: "Problem created" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal Server Error",
      success:false
    })
  }
}

