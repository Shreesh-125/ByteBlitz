import { Problems } from "../models/problems.model.js";

export const getPaginatedProblems = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const problems = await Problems.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Problems.countDocuments();

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      problems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postProblem = async (req, res) => {
  try {
    const newProblem = new Problems(req.body);
    await newProblem.save();
    res.status(201).json({ message: "Problem added successfully", newProblem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const problem = await Problems.findOne({ problemId: req.params.id });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const problem = await Problems.findOneAndUpdate(
      { problemId: req.params.id },
      req.body,
      { new: true }
    );
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
