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
  problemId:{type:Number,required:true},
  accepted: [acceptedSchema],
  rejected: [rejectedSchema],
});

// User contest info
const userContestInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
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


const LeaderboardSchema = new mongoose.Schema({
  contestId:{
    type:Number,
    required: true
  },
  contestStartTime:Date,
  users: {
    type: [userContestInfoSchema]
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
  }
});

export const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
