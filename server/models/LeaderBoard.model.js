import mongoose from "mongoose";

// Accepted Submission Schema
const acceptedSchema = new mongoose.Schema({
  time: { type: Date, required: true },
  submissionId: { type: mongoose.Schema.Types.ObjectId },
});

// Rejected Submission Schema
const rejectedSchema = new mongoose.Schema({
  time: { type: Date, required: true },
  submissionId: { type: mongoose.Schema.Types.ObjectId },
});

const problemSolvedSchema = new mongoose.Schema({
  attempted: { type: Boolean, default: false },
  accepted: [acceptedSchema],
  rejected: [rejectedSchema],
});

// User contest info
const userContestInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  problemSolved: {
    type: [problemSolvedSchema],
  },
  score: {
    type: Number,
    default: 0,
  },
});

// Specific contest information
const ContestInfoSchema = new mongoose.Schema({
  users: {
    type: [userContestInfoSchema],
    required: true,
  },
  problemScore: {
    type: [
      {
        problemId: {
          type: Number,
          required: true,
        },
        problemScore: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
});

const LeaderboardSchema = new mongoose.Schema({
  contests: {
    type: [ContestInfoSchema],
  },
});

export const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
