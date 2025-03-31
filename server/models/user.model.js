import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  submissions: [
    {
      problemId: {
        type: Number,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["Accepted", "Rejected", "Pending"],
        required: true,
      },
      error: {
        type: String,
        enum: [
          "Wrong Answer",
          "Time Limit Exceeded (TLE)",
          "Compilation Error",
          "Runtime Error",
          "Execution Time Limit Exceeded",
          "Memory Limit Exceeded (MLE)",
          "Compiled With No Error",
        ],
        required: true,
      },
      date: {
        type: String,
        default: () => {
          const now = new Date();
          const options = {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          };
          return now.toLocaleString("en-US", options).replace(",", "");
        },
        required: true,
      },
      language: {
        type: String,
        enum: ["c++", "java", "python"],
        required: true,
      },
      hidden: {
        type: Boolean,
        required: true,
        default: true,
      },
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
  problem_solved: [
    {
      date: {
        type: String,
        default: () => {
          const now = new Date();
          const day = String(now.getDate()).padStart(2, "0");
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const year = now.getFullYear();
          return `${day}/${month}/${year}`;
        },
        required: true,
      },
      problemSolved: {
        type: Number,
        required: true,
      },
    },
  ],
  contests: [
    {
      contestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "contests",
      },
      rank: {
        type: Number,
        required: true,
      },
      ratingChange: {
        type: Number,
        required: true,
      },
      newRating: {
        type: Number,
        required: true,
      },
    },
  ],
  maxRating: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendsOf: {
    type: Number,
    default: 0,
  },
  country: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

export const User = mongoose.model("User", userSchema);
