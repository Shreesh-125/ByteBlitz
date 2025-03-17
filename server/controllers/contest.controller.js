import axios from "axios";
import { Contests } from "../models/constests.model.js";
import { Leaderboard } from "../models/LeaderBoard.model.js";
import { Problems } from "../models/problems.model.js";
import { languageMap, StatusIdMap } from "../utils/maps.js";
import { User } from "../models/user.model.js";
import { scheduleContestUpdates } from "../services/contestScheduler.js";

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

export const createContest = async (req, res,io) => {
  try {
    const { problems, startTime, endTime, status, problemScore } = req.body;

    // Validate required fields
    if (!problems || !startTime || !endTime || !status || !problemScore) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const now = new Date();

    // Parse input times as IST
    const startIST = new Date(startTime);
    const endIST = new Date(endTime);

    // Validate date format
    if (isNaN(startIST.getTime()) || isNaN(endIST.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Validate start time is in the future
    if (startIST <= now) {
      return res.status(400).json({ message: "Start time must be in the future" });
    }

    // Validate end time is after start time
    if (endIST <= startIST) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    // Convert IST to UTC
    const startUTC = new Date(startIST.getTime() - 5.5 * 60 * 60 * 1000); // IST is UTC+5:30
    const endUTC = new Date(endIST.getTime() - 5.5 * 60 * 60 * 1000);

    // Create contest with UTC times
    const contest = await Contests.create({
      problems,
      startTime: startUTC.toISOString(), // Save as UTC
      endTime: endUTC.toISOString(), // Save as UTC
      status,
      submissions: [],
      registeredUser: []
    });

    if (!contest) {
      return res.status(400).json({ message: "Error creating contest" });
    }

    // Create leaderboard with original IST times
    const leaderboard = await Leaderboard.create({
      contestId: contest.contestId,
      contestStartTime: startTime, // Save original IST time
      problemScore,
      users: []
    });

    if (!leaderboard) {
      return res.status(400).json({ message: "Error while creating leaderboard", success: false });
    }

    // Schedule contest updates (if needed)
    scheduleContestUpdates(contest);

    // Return success response
    res.status(201).json({ contest, leaderboard });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const contestProblemSubmitCode= async(req,res)=>{
  try {
    const { code, languageId } = req.body;
    const { problemid } = req.params;

    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "Username not found",
        success: false,
      });
    }

    const problem = await Problems.findOne({ problemId: problemid });

    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    // Convert "1s" -> 1 and "256MB" -> 256000 (KB)
    const cpuTimeLimit = parseInt(problem.timeLimit.replace("s", ""), 10);
    const memoryLimit =
      parseInt(problem.memoryLimit.replace("MB", ""), 10) * 1000;

    const language = languageMap[languageId];

    let submission = {
      problemId: problemid,
      code: code,
      status: "Pending",
      language: language,
      hidden:true,
    };
    let isServerError = false;
    for (const tc of problem.sampleTestCase) {
      const formattedInput = JSON.stringify(tc.input).replace(/\\n/g, "\n");
      const formattedOutput = JSON.stringify(tc.output).replace(/\\n/g, "\n");

      const submissionData = {
        source_code: code,
        language_id: languageId,
        stdin: formattedInput.slice(1, -1),
        expected_output: formattedOutput.slice(1, -1),
        cpu_time_limit: cpuTimeLimit,
        memory_limit: memoryLimit,
        number_of_runs: 1,
      };

      // Submit code to Judge0
      const response1 = await axios.post(
        "http://localhost:2358/submissions?base64_encoded=false&wait=true",
        submissionData
      );

      if (!response1.data || !response1.data.token) {
        return res
          .status(500)
          .json({ message: "Failed to submit code", success: false });
      }

      // Wait for Judge0 to complete execution
      await new Promise((resolve) =>
        setTimeout(resolve, (cpuTimeLimit + 1) * 1000)
      );

      // Fetch submission result
      const response2 = await axios.get(
        `http://localhost:2358/submissions/${response1.data.token}?base64_encoded=false&wait=false`
      );

      // If status ID is not 3 (Accepted), return immediately
      if (response2.data.status.id !== 3) {
        if (response2.data.status.id === 13) {
          isServerError = true;
          break;
        }

        submission = {
          ...submission,
          status: "Rejected",
          error: StatusIdMap[response2.data.status.id],
        };
        user.submissions = [...user.submissions, submission];
        await user.save();

        return res.status(200).json({
          message: "Submission failed",
          status: response2.data.status,
          stderr: response2.data.stderr,
          compile_output: response2.data.compile_output,
          submissionId: user.submissions[user.submissions.length - 1]._id
        });
      }
    }

    if (isServerError) {
      return res
        .status(500)
        .json({ message: "Failed to submit code", success: false });
    }

    submission = { ...submission, status: "Accepted", error: StatusIdMap[3] };
    user.submissions = [...user.submissions, submission];
    await user.save();
    // If all test cases pass
    return res.status(200).json({
      message: "Accepted",
      success: true,
      submissionId: user.submissions[user.submissions.length - 1]._id
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
