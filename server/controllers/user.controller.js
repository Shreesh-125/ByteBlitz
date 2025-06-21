import { User } from "../models/user.model.js";
import { Problems } from "../models/problems.model.js";
import { Contests } from "../models/constests.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Blog } from "../models/blog.model.js";
import S3Service from "../services/s3Service.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

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
        httpOnly: true,
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
    const today = new Date();

    // Get only upcoming contests where startTime is today or in the future
    const contests = await Contests.find({
      status: "upcoming",
      startTime: { $gte: today },
    });

    // if (!contests.length) {
    //   return null; // or handle no upcoming contests
    // }

    // this will handle upcoming contests
    let nearest = null;
    if (contests.length) {
      nearest = contests[0];
      let minDiff = Math.abs(nearest.startTime - today);

      for (let i = 1; i < contests.length; i++) {
        const diff = Math.abs(contests[i].startTime - today);
        if (diff < minDiff) {
          minDiff = diff;
          nearest = contests[i];
        }
      }
    }


    // Fetch latest blogs and populate author username
    const blogs = await Blog.find()
      .populate("author", "username")
      .sort({ updatedAt: -1 })
      .limit(6);

    // Format blog data
    const formattedBlogs = blogs.map((blog) => ({
      id: blog._id,
      title: blog.title,
      author: blog.author?.username || "default1",
      updatedAt: blog.updatedAt,
      snippet: blog.content,
    }));

    // Get top users by rating
    const topUsers = await User.find({}, "_id username rating")
      .sort({ rating: -1 })
      .limit(10);

    // Send success response
    return res.status(200).json({
      message: "Data Fetched Successfully",
      success: true,
      Blogs: formattedBlogs,
      nearestContest: nearest,
      topUsers,
    });
  } catch (error) {
    console.error("Error fetching homepage details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const findUser = async (req, res) => {
  try {
    const { username } = req.body;


    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    // Perform a case-insensitive partial match using regex
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    }).limit(10); // Limit to 10 results for performance

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    const userDetails = users.map((user) => ({
      username: user.username,
      email: user.email,
      rating: user.rating,
      maxRating: user.maxRating,
    }));

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: userDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProfileDetails = async (req, res) => {
  try {
    const { username } = req.params;

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
      profilePhoto: user?.profilePhoto
    };
    return res.status(200).json({
      success: true,
      message: "User Details Fetched Successfully",
      user: modifieduser,
    });
  } catch (error) { }
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
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Username Not Found",
      });
    }

    const contests = user.contests.map((contest) => ({
      contestId:contest.contestId,
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

export const isFriend = async (req, res) => {
  try {
    const { userid, friendUsername } = req.params;

    if (!userid || !friendUsername) {
      return res.status(400).json({
        message: "userId and username required",
        success: false
      });
    }

    // Check if userid is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userid)) {
      return res.status(400).json({
        message: "Invalid user ID format",
        success: false
      });
    }

    // Find the current user and check if the friend is in their friends array
    const currentUser = await User.findById(userid);
    const friendUser = await User.findOne({ username: friendUsername });

    if (!currentUser || !friendUser) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    // Check if friendUser's ID exists in currentUser's friends array
    const isFriend = currentUser.friends.some(friendId =>
      friendId.equals(friendUser._id)
    );

    return res.status(200).json({
      success: true,
      isFriend,
      message: isFriend ? "Users are friends" : "Users are not friends"
    });

  } catch (error) {
    console.error("Error checking friendship:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
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

export const getfriends = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        message: "Username is required",
        success: false
      });
    }

    // Find the user and populate the friends field with usernames
    const user = await User.findOne({ username })
      .populate({
        path: 'friends',
        select: 'username' // Only select the username field from friends
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    // Extract usernames from the populated friends array
    const friendsList = user.friends.map(friend => friend.username);

    return res.status(200).json({
      message: "Friends list retrieved successfully",
      success: true,
      data: friendsList
    });

  } catch (error) {
    console.error("Error while getting friends:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message
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


export const uploadProfilePic = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No file uploaded', 400);

    const user = await User.findOne({ username: req.params.username });
    if (!user) throw new AppError('User not found', 404);

    // Delete old image if exists
    if (user.profilePhoto) {
      const oldKey = S3Service.extractKeyFromUrl(user.profilePhoto);
      await S3Service.deleteFile(oldKey);
    }

    user.profilePhoto = req.file.location;
    await user.save();

    res.status(200).json({
      status: 'success',
      data: { profilePhoto: user.profilePhoto }
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProfilePic = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) throw new AppError('User not found', 404);
    if (!user.profilePhoto) throw new AppError('No profile picture exists', 400);

    const key = S3Service.extractKeyFromUrl(user.profilePhoto);
    await S3Service.deleteFile(key);

    user.profilePhoto = undefined;
    await user.save();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};