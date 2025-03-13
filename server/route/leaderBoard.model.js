import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    contestId: {
      type: Number,
      ref: "Contest",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    lastSubmissionTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

module.exports = Leaderboard;
