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

    const {problems,startTime,endTime,status,problemScore}=req.body;
    const contest = await Contests.create({
      problems,startTime,endTime,status,
      submissions:[],
      registeredUser:[]
    });
    if (!contest) {
      return res.status(400).json({ message: "there is no contest body " });
    }
    const leaderboard=await Leaderboard.create({
      contestId:contest.contestId,
      contestStartTime:startTime,
      problemScore:problemScore,
      users:[]
    })
    
    if(!leaderboard){
      return res.status(400).json({
        message:"Error While creating contest",
        success:false
      })
    }
    
    scheduleContestUpdates(contest);
    res.status(201).json({contest,leaderboard});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
