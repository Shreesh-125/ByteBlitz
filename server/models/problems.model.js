import mongoose from "mongoose";

const questionDescriptionSchema = new mongoose.Schema({
  questionDesc: { type: String, required: true },
  input: { type: String, required: true },
  output: { type: String, required: true },
  constraint: { type: [String], required: true },
});

const sampleTestCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
});

const problemSchema = new mongoose.Schema({
  questionTitle: { type: String, required: true },
  timeLimit: { type: String, required: true },
  memoryLimit: { type: String, required: true },
  questionDescription: { type: questionDescriptionSchema, required: true },
  sampleTestCase: { type: [sampleTestCaseSchema], required: true },
  rating: { type: Number, required: true },
  hidden: { type: Boolean, required: true },
});

export const Problems = mongoose.model("problems", problemSchema);
