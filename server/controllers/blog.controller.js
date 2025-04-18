import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";

export const postBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and Content are required",
        success: false,
      });
    }

    const userId = req.id; // Assuming req.id contains the authenticated user's ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Create a new blog post
    const blog = await Blog.create({
      title,
      content,
      tags,
      author: userId, // Assuming the Blog schema has an 'author' field
      authorUsername:user.username
    });

    // Optionally, add the blog to the user's list of blogs
    user.blogs = user.blogs ? [...user.blogs, blog._id] : [blog._id];
    await user.save();

    res.status(201).json({
      success: true,
      message: "Blog posted successfully",
      data: {
        blogId: blog._id,
        title: blog.title,
        author: user.name,
        authorUsername:user.username,
        createdAt: blog.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to post blog",
      error: error.message,
    });
  }
};

export const getBlogsByUserName = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .populate({
        path: "blogs",
        select: "title content updatedAt",
        options: { sort: { updatedAt: -1 } }, // Sort by latest
      })
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Map the blogs to return only the necessary information
    const blogData = user.blogs.map((blog) => ({
      id: blog._id,
      title: blog.title,
      snippet:
        blog.content.substring(0, 100) +
        (blog.content.length > 100 ? "..." : ""),
      updatedAt: blog.updatedAt,
    }));

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      data: blogData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the blog with author details
    const blog = await Blog.findById(id)
      .populate("author", "username _id")
      .lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: {
        id: blog._id,
        title: blog.title,
        content: blog.content,
        tags: blog.tags,
        author: blog.author?.username,
        authorId: blog.author?._id,
        updatedAt: blog.updatedAt,
        createdAt: blog.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

export const getAllBlog = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch blogs with pagination
    const blogs = await Blog.find().skip(skip).limit(limit);

    // Get total count of blogs for pagination metadata
    const totalBlogs = await Blog.countDocuments();

    res.status(200).json({
      message: "ok",
      page,
      limit,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
      blogs,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "not able to send data internal server error" });
  }
};
