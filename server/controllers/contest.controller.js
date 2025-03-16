import axios from "axios";
import { Contests, scheduleContestUpdates } from "../models/constests.model.js";
import { Leaderboard } from "../models/LeaderBoard.model.js";
import { Problems } from "../models/problems.model.js";
import { languageMap } from "../utils/maps.js";

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
    const contestID = req.params.id;
    if (!contestID) {
      return res.status(400).json({ message: "There is no contestId in body" });
    }
    const contest = await Contests.findById(contestID);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    res.status(200).json(contest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createContest = async (req, res) => {
  try {
    const { problems, startTime, endTime, status, problemScore } = req.body;
    
    if (!problems || !startTime || !endTime || !status || !problemScore) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const now = new Date();
    
    const startIST = new Date(startTime);
    const endIST = new Date(endTime);

    if (isNaN(startIST.getTime()) || isNaN(endIST.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (startIST <= now) {
      return res.status(400).json({ message: "Start time must be in the future" });
    }
    if (endIST <= startIST) {
      return res.status(400).json({ message: "End time must be after start time" });
    }



    const contest = await Contests.create({
      problems,
      startTime:  startIST.toISOString(),
      endTime: endIST.toISOString(),
      status,
      submissions: [],
      registeredUser: []
    });

    if (!contest) {
      return res.status(400).json({ message: "Error creating contest" });
    }

    const leaderboard = await Leaderboard.create({
      contestId: contest.contestId,
      contestStartTime: startTime,
      problemScore,
      users: []
    });

    if (!leaderboard) {
      return res.status(400).json({ message: "Error while creating leaderboard", success: false });
    }

    scheduleContestUpdates(contest);
    res.status(201).json({ contest, leaderboard });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
