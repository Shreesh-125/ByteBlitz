const mongoose = require("mongoose");

const problemSchema = mongoose.Schema({
  problemId: {
    type: Number,
    required: true,
  },
  problemTitle: {
    type: String,
    required: true,
  },
  solvedBy: {
    type: Number,
    required: true,
  },
  attemptedBy: {
    type: Number,
    required: true,
  },
});

const contestSchema = new mongoose.Schema({
  problems: { type: [problemSchema], required: true },
  submissions: { type: [String], required: true },
});

export const Contests = mongoose.model("Contests", problemSchema);
