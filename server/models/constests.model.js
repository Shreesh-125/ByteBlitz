import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

// Problem Schema
const problemSchema = new mongoose.Schema({
  problemId: { type: Number, required: true, ref: "problems" },
  problemTitle: { type: String, required: true },
  solvedBy: { type: Number, required: true },
  attemptedBy: { type: Number, required: true },
});

// Contest Schema
const contestSchema = new mongoose.Schema({
  contestId: { type: Number, unique: true },
  problems: { type: [problemSchema], required: true },
  submissions: { type: [String], required: true },


  registeredUser: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    ],
    default: [],
  },

  startTime: Date,
  endTime: Date,


  status: {
    type: String,
    enum: ["upcoming", "running", "ended"],
    default: "upcoming",
  },
});

// Apply AutoIncrement Plugin to Contest ID
contestSchema.plugin(AutoIncrement(mongoose), { inc_field: "contestId" });

// Export Contest Model
export const Contests = mongoose.model("Contests", contestSchema);
