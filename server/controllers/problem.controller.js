import { Problems } from "../models/problems.model.js";
import axios from "axios";
import { User } from "../models/user.model.js";
import { languageMap, StatusIdMap } from "../utils/maps.js";
import { response } from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const getPaginatedProblems = async (req, res) => {
  try {
    let {
      page = "1",
      limit = "15",
      tags = "",
      minRating = "0",
      maxRating = "5000",
      sortBy = "rating",
      order = "desc",
    } = req.query;
    // Convert query parameters to correct types
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 20;
    minRating = parseInt(minRating, 10) || 0;
    maxRating = parseInt(maxRating, 10) || 1500;
    order = order === "asc" ? 1 : -1; // Convert order to MongoDB sort format

    let filter = {};

    // Apply tags filter if provided
    if (tags.trim()) {
      const tagsArray = tags.split(",").map((tag) => tag.trim()); // Convert comma-separated string to array
      filter.tags = { $all: tagsArray };
    }

    // Apply rating (difficulty) range filter
    filter.rating = { $gte: minRating, $lte: maxRating };

    // Fetch paginated & sorted problems
    const problems = await Problems.find(filter)
      .sort({ [sortBy]: order }) // Sorting dynamically
      .skip((page - 1) * limit)
      .limit(limit);

    // Count total problems matching the filter
    const total = await Problems.countDocuments(filter);

    res.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      problems,
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const postProblem = async (req, res) => {
  try {
    const newProblem = new Problems(req.body);
    if (!newProblem) {
      return res.status(500).json({ error: "there is no problem in the body" });
    }
    await newProblem.save();
    res.status(201).json({ message: "Problem added successfully", newProblem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const {problemid}= req.params;
    const problem = await Problems.findOne({ problemId:problemid });
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

    return res.status(200).json({
      success:true,
      message:"Problem info retrieved sucessfully",
      response
    });
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

export const submitcode = async (req, res) => {
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
      hidden: false,
      rating:problem.rating
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
        `${process.env.JUDGE0_URL}/submissions?base64_encoded=false`,
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
        `${process.env.JUDGE0_URL}/submissions/${response1.data.token}?base64_encoded=true`
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
          time:response2.data.time,
          memory:response2.data.memory
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

    submission = { ...submission, status: "Accepted", error: StatusIdMap[3],time:totaltime,memory:totalmemory };
    user.submissions = [...user.submissions, submission];
    await user.save();
    // If all test cases pass
    return res.status(200).json({
      message: "accepted",
      success: true,
      status:{id:3,description:"Accepted"},
      submissionId: user.submissions[user.submissions.length - 1]._id,
      totalTestCase:testcasenumber,
      time: parseFloat(totaltime.toFixed(2)),
      memory:totalmemory
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const checkCustomTestCase = async (req,res)=>{
  try {
    const { languagecode, value,customInput } = req.body;
   
    if(!languagecode || !value ){
      return res.status(400).json({
        message:"All fields are required",
        success:false
      })
    }
   
    const submissionData = {
      source_code: value,
      language_id: languagecode,
      stdin: customInput,
      cpu_time_limit: 2,
      number_of_runs: 1,
    };
  
    const response1 = await axios.post(
      `${process.env.JUDGE0_URL}/submissions?base64_encoded=false`,
      submissionData
    );
    console.log(response1.data);
    
    if (!response1.data || !response1.data.token) {
      return res
        .status(500)
        .json({ message: "Failed to submit code", success: false });
    }

    // Wait for Judge0 to complete execution
    await new Promise((resolve) =>
      setTimeout(resolve, (3) * 1000)
    );
    
    // Fetch submission result
    const response2 = await axios.get(
      `${process.env.JUDGE0_URL}/submissions/${response1.data.token}?base64_encoded=true`
    );
    // console.log(response2.data);
    
    if(response2.data.status.id==13){
      return res.status(400).json({
        message:"Judge0 Error",
        success:false
      })
    }
    
    if(response2.data.status.id!=3){
      return res.status(200).json({
        response:{
        isError:true,
      output:response2.data.status.description
    }
      })
    }
    
    const response3 = await axios.get(
      `${process.env.JUDGE0_URL}/submissions/${response1.data.token}?base64_encoded=false`
    );
    
    return res.status(200).json({
      response:{
        output:response3.data.stdout,
        isError:false
      }
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

export const getUserProblemSubmissions = async (req, res) => {
  try {
    const { userId, problemId } = req.params;
    
    // Validate input
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // Convert problemId to number if needed (or keep as string if that's your schema)
    const numericProblemId = Number(problemId);
    if (isNaN(numericProblemId)) {
      return res.status(400).json({
        success: false,
        message: "Problem ID must be a number"
      });
    }

    // Find user and filter submissions
    const user = await User.findById(userId).select('submissions');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Filter submissions for the specific problem and sort by date (newest first)
    const problemSubmissions = user.submissions
      .filter(submission => submission.problemId === numericProblemId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10); // Take only the first 10 submissions

    return res.status(200).json({
      success: true,
      submissions: problemSubmissions,
      count: problemSubmissions.length
    });

  } catch (error) {
    console.error("Error fetching user submissions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};