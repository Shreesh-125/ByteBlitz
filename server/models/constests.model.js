import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";
const problemSchema = new mongoose.Schema({
  problemId: { type: Number, required: true },
  problemTitle: { type: String, required: true },
  solvedBy: { type: Number, required: true },
  attemptedBy: { type: Number, required: true },
});

const contestSchema = new mongoose.Schema({
  contestId: { type: Number, unique: true },
  problems: { type: [problemSchema], required: true },
  submissions: { type: [String], required: true },
});

contestSchema.plugin(AutoIncrement(mongoose), { inc_field: "contestId" });

export const Contests = mongoose.model("contests", contestSchema);
