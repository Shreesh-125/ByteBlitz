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
    
    // Fetch contests but exclude 'problems' and 'submissions'
    const contests = await Contests.find()
      .select("-problems -submissions") // Exclude these fields
      .skip(skip)
      .limit(limit);
    console.log(contests);
    
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

export const createContest = async (req, res, io) => {
  try {
    const { problems, startTime, endTime, status, problemScore } = req.body;

    // Validate required fields
    if (!problems || !startTime || !endTime || !status || !problemScore) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create contest with UTC times
    const contest = await Contests.create({
      problems,
      startTime: startTime, // Save as UTC
      endTime: endTime, // Save as UTC
      status,
      submissions: [],
      registeredUser: []
    });

    if (!contest) {
      return res.status(400).json({ message: "Error creating contest" });
    }

    // Convert UTC to IST for leaderboard
    const startTimeUTC = new Date(startTime); // Parse input UTC time
    const startTimeIST = new Date(startTimeUTC.getTime() + 5.5 * 60 * 60 * 1000); // Add 5.5 hours for IST

    // Create leaderboard with IST time
    const leaderboard = await Leaderboard.create({
      contestId: contest.contestId,
      contestStartTime: startTimeIST.toISOString(), // Save as IST
      problemScore,
      users: []
    });

    if (!leaderboard) {
      return res.status(400).json({ message: "Error while creating leaderboard", success: false });
    }

    // Schedule contest updates (if needed)
    scheduleContestUpdates(contest, io); // Pass `io` here

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
    let testcasenumber=0,totaltime=0,totalmemory=0;
    for (const tc of problem.sampleTestCase) {
      testcasenumber++;
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
        `http://localhost:2358/submissions/${response1.data.token}?base64_encoded=true&wait=false`
      );
      totaltime+=Number(response2.data.time);
      totalmemory+=response2.data.memory
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
          submissionId: user.submissions[user.submissions.length - 1]._id,
          WrongOnTestCase:testcasenumber,
          time:response2.data.time,
          memory:response2.data.memory,
          totalTestCase:problem.sampleTestCase.length
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
      message: "accepted",
      success: true,
      status:{id:3,description:"accepted"},
      submissionId: user.submissions[user.submissions.length - 1]._id,
      totalTestCase:testcasenumber,
      time:totaltime,
      memory:totalmemory
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

export const registerForContest=async(req,res)=>{
  try {
    const {userId,contestId}=req.params;
    
    const user= await User.findById(userId)

    if(!user){
      return res.status(400).json({
        message:"User not found",
        success:false
      })
    }

    const contest=await Contests.findOne({contestId:contestId});

    if(!contest){
      return res.status(400).json({
        message:"Contest not found",
        success:false
      })
    }

    if(contest.status=="ended"){
      return res.status(400).json({
        message:"contest Ending Cannot Register",
        success:false
      })
    }
    
    if (contest.registeredUser.includes(userId)) {
      return res.status(400).json({
        message: "User already registered",
        success: false
      });
    }

    contest.registeredUser.push(userId);
    await contest.save();

    return res.status(200).json({
      message:"Registered Successfully",
      success:true
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal Server Error",
      success:false
    })
  }
}

export const getContestProblem = async (req, res) => {
  try {
      const { contestId } = req.params;

      if (!contestId) {
          return res.status(400).json({
              message: "Contest ID is required",
              success: false,
          });
      }

      const contest = await Contests.findOne({ contestId: contestId });

      if (!contest) {
          return res.status(200).json({
              message: "Contest not found",
              success: false,
              contestAccessible: false, 
              isrunning:false,
          });
      }

      if (contest.status === 'upcoming') {
          return res.status(200).json({
              message: "Contest has not started yet",
              success: false,
              contestAccessible: false, 
              isrunning:false,
          });
      }

      if(contest.status ==='running'){
        return res.status(200).json({
          message:"Contest is running",
          success:true,
          contestAccessible: true, // Additional flag to indicate contest is accessible
          isrunning:true,
          problems: contest.problems,
          endTime:contest.endTime
        })
      }

      return res.status(200).json({
          message: "Problem fetched successfully",
          success: true,
          contestAccessible: true, // Additional flag to indicate contest is accessible
          isrunning:false,
          problems: contest.problems,
      });

  } catch (error) {
      return res.status(500).json({
          message: "Internal Server Error",
          success: false,
      });
  }
};

export const getContestProblemById = async (req, res) => {
  try {
    const { problemId, contestId } = req.params;
   
    // Find the contest
    const contest = await Contests.findOne({ contestId });
    
    if (!contest) {
      return res.status(400).json({
        message: "Contest Not Found",
        success: false,
      });
    }
    
    // Check if the problemId exists in the contest's problems array
    const problemExists = contest.problems.some(
      (problem) => problem.problemId.toString() === problemId
    );
    
    if (!problemExists) {
      return res.status(404).json({
        message: "Problem not found in contest",
        success: false,
      });
    }

    // Find the problem
    const problem = await Problems.findOne({ problemId });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Extract only the first test case from sampleTestCase
    const firstSampleTestCase = problem.sampleTestCase[0];

    // Create a new response object with only the first test case
    const response = {
      ...problem.toObject(), // Spread the rest of the problem details
      sampleTestCase: firstSampleTestCase, // Override sampleTestCase with only the first test case
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const isRegisteredInContest =async(req,res)=>{
  try {
    const {contestId,userId}= req.body;

    const contest= await Contests.findOne({contestId});

    if(!contest){
      return res.status(400).json({
        message: "Contest Not Found",
        success: false,
      });
    }

    const isregister= contest.registeredUser?.includes(userId) || false;
    
    return res.status(200).json({
      isregister,
      success:true
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getContestStatus =async (req,res)=>{
  try {
    const {contestId}= req.params;
    const contest= await Contests.findOne({contestId});

    if(!contest){
      return res.status(400).json({
        message: "Contest Not Found",
        success: false,
      });
    }
    return res.status(200).json({
      status:contest?.status,
      success:true
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}