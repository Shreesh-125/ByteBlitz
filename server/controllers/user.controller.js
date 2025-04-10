import { User } from "../models/user.model.js";
import { Problems } from "../models/problems.model.js";
import { Contests } from "../models/constests.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Blog } from "../models/blog.model.js";

export const signup = async (req, res) => {
  try {
    const { fullname, username, password, email, country } = req.body;
    if (!fullname || !username || !password || !email || !country) {
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
      country,
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
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userResponse = {
      username: user.username,
      email: user.email,
      _id: user._id,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back!! `,
        user: userResponse,
        token,
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

export const getHomepageDetails = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not Found",
        success: false,
      });
    }

    let userDetails = {
      username: user.username,
      rating: user.rating,
    };

    const blogs = await Blog.find().sort({ updatedAt: -1 }).limit(6);

    const formattedBlogs = blogs.map((blog) => ({
      id: blog._id,
      title: blog.title,
      updatedAt: blog.updatedAt,
      snippet:
        blog.content.substring(0, 100) +
        (blog.content.length > 100 ? "..." : ""), // Limit content to 100 chars
    }));

    const topUsers = await User.find({}, "_id username rating")
      .sort({ rating: -1 })
      .limit(10);

    return res.status(200).json({
      message: "Data Fetched Successfully",
      success: true,
      user: userDetails,
      Blogs: formattedBlogs,
      topUsers: topUsers,
    });
  } catch (error) {}
};

export const findUser = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
        success: false,
      });
    }

    let userDetails = {
      username: user.username,
      email: user.email,
      rating: user.rating,
      maxRating: user.maxRating,
    };

    return res.status(200).json({
      success: true,
      message: "user Detailed Fetched Successfully",
      user: userDetails,
    });
  } catch (error) {
    return (
      res.status(500),
      json({
        message: "Internal Server Error",
        success: false,
      })
    );
  }
};

export const getProfileDetails = async (req, res) => {
  try {
    const { username } = req.params;
    console.log(username);
    // console.log(user);
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Username Not Found",
      });
    }
    const submissions = user.submissions.map((submission) => ({
      problemId: submission.problemId,
      rating: submission.rating || 0,
      status: submission.status || "rejected",
      date: submission.date,
      language: submission.language,
    }));
    const submissionCalender = user.submissions.reduce((acc, item) => {
      const date = item.date.split(",")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    let modifieduser = {
      username: user.username,
      email: user.email,
      rating: user.rating,
      maxRating: user.maxRating,
      contests: user.contests,
      friends: user.friends,
      friendsOf: user.friendsOf,
      submissions: submissions,
      submissionCalender,
    };
    return res.status(200).json({
      success: true,
      message: "User Details Fetched Successfully",
      user: modifieduser,
    });
  } catch (error) {}
};

export const getUserSubmissions = async (req, res) => {
  try {
    const { username } = req.params;
    let { page = 1, limit = 20 } = req.query; // Default page = 1, limit = 10

    page = parseInt(page);
    limit = parseInt(limit);

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Username Not Found",
      });
    }
    // Sort submissions by date (most recent first)
    const sortedSubmissions = user.submissions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const totalSubmissions = sortedSubmissions.length; // Get total count
    const totalPages = Math.ceil(totalSubmissions / limit);
    const paginatedSubmissions = sortedSubmissions
      .slice((page - 1) * limit, page * limit)
      .map((submission) => ({
        problemId: submission.problemId || "Unknown",
        questionTitle: submission.questionTitle || "Unknown",
        rating: submission.rating || 0,
        status: submission.status,
        date: submission.date,
        language: submission.language,
      }));

    return res.status(200).json({
      success: true,
      message: "User Submissions Fetched Successfully",
      submissions: paginatedSubmissions,
      pagination: {
        currentPage: page,
        totalPages,
        totalSubmissions,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSubmissionDetails = async (req, res) => {
  try {
    const { username, submissionId } = req.params;

    // Find the user by username and filter the specific submission
    const user = await User.findOne(
      { username, submissionId },
      { "submissions.$": 1 } // Only return the matching submission
    );

    if (!user || user.submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    const { code, language, date } = user.submissions[0];

    return res.status(200).json({
      success: true,
      message: "Submission details fetched successfully",
      submissionDetails: {
        code,
        language,
        date,
      },
    });
  } catch (error) {
    console.error("Error fetching submission details:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error - " + error.message,
    });
  }
};

export const getUserContests = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).populate(
      "contests.contestId",
      "name"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Username Not Found",
      });
    }

    const contests = user.contests.map((contest) => ({
      contestName: contest.contestId?.name || "Unknown",
      rank: contest.rank,
      ratingChange: contest.ratingChange,
      newRating: contest.newRating,
    }));

    return res.status(200).json({
      success: true,
      message: "User Contests Fetched Successfully",
      contests,
    });
  } catch (error) {
    console.error("Error fetching contests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const toggleFriend = async (req, res) => {
  try {
    const { userid, friendusername } = req.params;

    const user = await User.findById(userid);

    if (!user) {
      return res.status(400).json({
        message: "User not Found",
        success: false,
      });
    }

    const friend = await User.findOne({ username: friendusername });

    if (!friend) {
      return res.status(400).json({
        message: "User not Found",
        success: false,
      });
    }

    if (user.friends.includes(friend._id)) {
      user.friends = user.friends.filter(
        (friendId) => friendId.toString() !== friend._id.toString()
      );
      friend.friendsOf = friend.friendsOf - 1;
    } else {
      user.friends = [...user.friends, friend._id];
      friend.friendsOf = friend.friendsOf + 1;
    }

    await friend.save();

    await user.save();

    return res.status(200).json({
      message: "Friend updated Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  const { email, username, country, password } = req.body;
  try {
    await User.findOneAndUpdate({ email }, { username, country, password });
    const user = await User.findOne({ email });
    const modifieduser = {
      username: user.username,
      email: user.email,
    };
    console.log(modifieduser);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });
    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: modifieduser,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Profile update failed" });
  }
};

export const deleteUser = async (req, res) => {
  const { email } = req.query;
  try {
    await User.findOneAndDelete({ email });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "User deletion failed" });
  }
};

export const getRankingList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get total count of users
    const totalUsers = await User.countDocuments();

    // Get ranked users with pagination
    const users = await User.aggregate([
      {
        $addFields: {
          contestsCount: { $size: "$contests" }, // Calculate contests count
        },
      },
      {
        $sort: {
          rating: -1, // Primary sort by rating (descending)
          contestsCount: 1, // Secondary sort by contests count (ascending)
        },
      },
      {
        $project: {
          username: 1,
          rating: 1,
          maxRating: 1,
          contestsCount: 1,
          profilePhoto: 1,
          country: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    // Calculate ranks based on position (1-based index)
    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
    }));

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      data: {
        users: rankedUsers,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          usersPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching ranking list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ranking list",
      error: error.message,
    });
  }
};

export const getRecentSubmission = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required.",
      });
    }

    // Fetch user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const submissions = user.submissions || [];
    const sortedSubmissions = submissions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 7); // get top 7

    const formatedData = sortedSubmissions.map((subb) => ({
      title: subb.questionTitle,
      problemId: subb.problemId,
      code: subb.code,
    }));

    return res.status(200).json({
      success: true,
      message: "Recent submissions retrieved successfully.",
      submissions: formatedData,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
