import { User } from "../models/user.model.js";
import { Problems } from "../models/problems.model.js";
import { Contests } from "../models/constests.model.js";
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

export const getProfileDetails =async(req,res)=>{
    try {
        const {username}= req.params;
        const user=await User.findOne({username});

        if(!user){
          return res.status(400).json({
            success:false,
            message:"Username Not Found"
          })
        }
  
        let modifieduser={
          username:user.username,
          email:user.email,
          rating:user.rating,
          maxRating:user.maxRating
        }
        
        return res.status(200).json({
          success:true,
          message:"User Details Fetched Successfully",
          user:modifieduser
        })
        
    } catch (error) {
        
    }
}

export const getUserSubmissions = async (req, res) => {
  try {
      const { username } = req.params;
      const user = await User.findOne({ username }).populate('submissions.questionId', 'title');

      if (!user) {
          return res.status(400).json({
              success: false,
              message: "Username Not Found"
          });
      }

      const submissions = user.submissions.map(submission => ({
          submissionId:submission.submissionId,
          questionTitle: submission.questionId?.title || "Unknown",
          status: submission.status,
          date: submission.date,
          language: submission.language,
      }));
      
      return res.status(200).json({
          success: true,
          message: "User Submissions Fetched Successfully",
          submissions
      });
  } catch (error) {
      console.error("Error fetching submissions:", error);
      return res.status(500).json({
          success: false,
          message: "Internal Server Error"
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
          submissionDetails:{
            code,
            language,
            date
          }
          
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
      const user = await User.findOne({ username }).populate('contests.contestId', 'name');

      if (!user) {
          return res.status(400).json({
              success: false,
              message: "Username Not Found"
          });
      }

      const contests = user.contests.map(contest => ({
          contestName: contest.contestId?.name || "Unknown",
          rank: contest.rank,
          ratingChange: contest.ratingChange,
          newRating: contest.newRating
      }));

      return res.status(200).json({
          success: true,
          message: "User Contests Fetched Successfully",
          contests
      });
  } catch (error) {
      console.error("Error fetching contests:", error);
      return res.status(500).json({
          success: false,
          message: "Internal Server Error"
      });
  }
};
