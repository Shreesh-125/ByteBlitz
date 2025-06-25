import { Server } from "socket.io";
import { Leaderboard } from "../models/LeaderBoard.model.js";
import { languagetoIdMap } from "../utils/maps.js";
import cookie from "cookie";
import axios from "axios";

let contestRunning = true;

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.token;

    console.log(`User connected: ${socket.id}`);

    // Reject connection if contest is not running
    if (!contestRunning) {
      socket.emit("contest_not_running", {
        message: "Contest is not running!",
      });
      socket.disconnect(true);
      return;
    }

    // Reject connection if no token is provided
    if (!token) {
      console.log("No token provided, disconnecting...");
      socket.emit("unauthorized", { message: "Authentication failed" });
      socket.disconnect();
      return;
    }

    // Handle code submission
    socket.on("submit_code", async (data) => {
      if (!contestRunning) {
        socket.emit("submission_result", {
          message: "Contest is not running!",
        });
        return;
      }
      
      const currTime = new Date();
      const submissionData = {
        code: data.code,
        languageId: languagetoIdMap[data.language],
      };

      try {
        const fresponse = await axios.post(
          `http://localhost:8000/api/v1/contest/${data.problemId}/submitcode`,
          submissionData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
       
        const verdict = fresponse.data.status.id; // Problem status 3 if accepted
        let leaderboard = await Leaderboard.findOne({
          contestId: data.contestId,
        });

     
        if (!leaderboard) {
          return socket.emit("submission_result", {
            message: "Leaderboard not found!",
          });
        }
        // Ensure leaderboard has an array for accepted/rejected submissions
        if (!leaderboard.acceptedSubmissions) leaderboard.acceptedSubmissions = [];
        if (!leaderboard.rejectedSubmissions) leaderboard.rejectedSubmissions = [];
        
        let userEntry = leaderboard.users.find((user) =>
          user.userId.equals(data.userId)
        );
       
        
        if (!userEntry) {
          // Add the user if not submitted before
          userEntry = {
            userId: data.userId,
            problemSolved: [],
            score: 0,
          };
          leaderboard.users.push(userEntry);
        }
       
        let problemEntry = userEntry.problemSolved.find(
          (problem) => problem.problemId === Number(data.problemId)
        );
        
        if (!problemEntry) {
          problemEntry = {
            problemId: data.problemId,
            accepted: [],
            rejected: [],
          };
          userEntry.problemSolved.push(problemEntry);
        }
       
        const submissionRecord = {
          time: currTime,
          submissionId: fresponse.data.submissionId, // Assuming submissionId is returned
        };
        
        const problemScoreEntry = leaderboard.problemScore.find(
          (p) => p.problemId === Number(data.problemId)
        );
        
        if (!problemScoreEntry) {
          return socket.emit("submission_result", {
            message: "Problem score not found!",
          });
        }
       
        let problemScore = problemScoreEntry.problemScore;
       
        
        if (verdict === 3) {
          // Accepted
          problemEntry.accepted.push(submissionRecord);
          const timeElapsedMinutes = Math.floor(
            (currTime - leaderboard.contestStartTime) / (1000 * 60)
          );
          let finalScore = problemScore - timeElapsedMinutes;
          userEntry.score += finalScore;
          userEntry.score = Math.max(userEntry.score, problemScore / 4);
        } else {
          // Wrong answer
          problemEntry.rejected.push(submissionRecord);
          userEntry.score -= 50; // Hardcoded the wrong submission score
        }
       
        await leaderboard.save();
        
  
        socket.emit("see_output", fresponse.data);
      } catch (error) {
        console.error("Error submitting code:", error);
        socket.emit("submission_result", { message: "Failed to submit code" });
      }
    });
    socket.on("fetch_leaderboard", async (contestId) => {
      if (!contestRunning) {
        socket.emit("leaderboard_error", {
          message: "Contest is not running!",
        });
        return;
      }

      try {
        const leaderboard = await Leaderboard.findOne({ contestId })
        .populate({
            path: 'users.userId',
            select: 'username', 
            model: 'User'
        });

        if (!leaderboard) {
          return socket.emit("leaderboard_error", {
            message: "Leaderboard not found!",
          });
        }

        const leaderboardData = leaderboard.users.map((user) => ({
          userId: user.userId._id,
          username: user.userId.username,
          problemSolved: user.problemSolved,
          score: user.score,
        }));

        socket.emit("leaderboard_update", {leaderboardData,NumberOfProblems:leaderboard.problemScore.length});
      } catch (error) {
        // console.error("Error fetching leaderboard:", error);
        socket.emit("leaderboard_error", {
          message: "Failed to fetch leaderboard",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
