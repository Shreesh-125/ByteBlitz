import { Contests } from "../models/constests.model.js";

export const getAllcontests = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const contests = await Contests.find().skip(skip).limit(limit);
    const totalContests = await Contests.countDocuments();
    res.json({
      page,
      limit,
      totalPages: Math.ceil(totalContests / limit),
      totalContests,
      contests,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContestById = async (req, res) => {
  try {
    const contest = await Contests.findById(req.params.id);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    res.json(contest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createContest = async (req, res) => {
  try {
    const contest = await Contests.create(req.body);
    res.status(201).json(contest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
