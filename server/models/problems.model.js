import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

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
  problemId: { type: Number, unique: true },
  questionTitle: { type: String, required: true },
  timeLimit: { type: String, required: true },
  memoryLimit: { type: String, required: true },
  questionDescription: { type: questionDescriptionSchema, required: true },
  sampleTestCase: { type: [sampleTestCaseSchema], required: true },
  rating: { type: Number, required: true },
  hidden: { type: Boolean, required: true, default: true },
  tags: {
    type: [
      {
        type: String,
        enum: [
          "Strings",
          "Sorting",
          "Recursion",
          "Backtracking",
          "Divide and Conquer",
          "Greedy",
          "Dynamic Programming",
          "Graph",
          "Tree",
          "Stack",
          "Heap",
          "Hashing",
          "DFS",
          "BFS",
          "Brute Force",
          "Shortest Path",
          "Linked List",
          "Binary Tree",
          "Trie",
          "Queue",
          "HashMap",
          "Matrix",
          "Number Theory",
          "Probability",
          "Statistics",
          "Geometry",
          "Combinatorics",
          "Multithreading",
          "Parallel Computing",
          "Bit Manipulation",
          "Computational Geometry",
          "Network Flow",
        ],
      },
    ],
  },
});
problemSchema.plugin(AutoIncrement(mongoose), { inc_field: "problemId" });

export const Problems = mongoose.model("problems", problemSchema);
