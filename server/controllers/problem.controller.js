import Problem from "../models/problems.model.js";

export const getPaginatedProblems = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query; // Use let instead of const
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const problems = await Problem.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Problem.countDocuments();

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
    const newProblem = new Problem(req.body);
    await newProblem.save();
    res.status(201).json({ message: "Problem added successfully", newProblem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
