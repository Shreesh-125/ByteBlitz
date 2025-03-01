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
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'problems',
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
    },
  ],
  rating: {
    type: String,
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
  max_rating: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
  },
});

export const User = mongoose.model("User",userSchema);
