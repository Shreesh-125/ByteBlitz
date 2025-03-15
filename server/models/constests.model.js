import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

// Problem Schema
const problemSchema = new mongoose.Schema({
  problemId: { type: Number, required: true, ref: "problems" },
  problemTitle: { type: String, required: true },
  solvedBy: { type: Number, required: true },
  attemptedBy: { type: Number, required: true },
});

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

// Problem Solved Schema
const problemSolvedSchema = new mongoose.Schema({
  attempted: { type: Boolean, default: false },
  accepted: [acceptedSchema],
  rejected: [rejectedSchema],
});

// Registered User Schema
const registeredUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  problemSolved: [problemSolvedSchema],
});

// Contest Schema
const contestSchema = new mongoose.Schema({
  contestId: { type: Number, unique: true },
  problems: { type: [problemSchema], required: true },
  submissions: { type: [String], required: true },
  registeredUser: { type: [registeredUserSchema], default: [] },
});

// Apply AutoIncrement Plugin to Contest ID
contestSchema.plugin(AutoIncrement(mongoose), { inc_field: "contestId" });

// Export Contest Model
export const Contests = mongoose.model("Contests", contestSchema);
