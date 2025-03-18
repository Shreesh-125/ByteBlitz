import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./utils/db.js";
import cookieParser from "cookie-parser";
import userRoute from "./route/user.route.js";
import blogRoute from "./route/blog.route.js";
import adminRoute from "./route/admin.route.js";
import problemRoute from "./route/problem.route.js";
import contestRoute from "./route/contest.route.js";
import { languagetoIdMap } from "./utils/maps.js";
import cookie from "cookie";
import { Leaderboard } from "./models/LeaderBoard.model.js";

dotenv.config({});
const app = express();
const PORT = process.env.PORT || 2000;

//  Create HTTP server for WebSockets
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cookieParser());

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOption));

// Contest State Management
let contestRunning = true;
// let leaderboard = {};

// WebSocket Logic

// 🔹 WebSocket Logic
io.on("connection", (socket) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie || "");
  const token = cookies.token;

  console.log(`User connected: ${socket.id}`);

  // if (!contestRunning) {
  //   socket.emit("contest_not_running", { message: "Contest is not running!" });
  //   io.emit("contest_ended");
  //   socket.disconnect(true);
  //   return;
  // }
  if (!token) {
    console.log("No token provided, disconnecting...");
    socket.emit("unauthorized", { message: "Authentication failed" });
    socket.disconnect();
    return;
  }

  socket.on("submit_code", async (data) => {
    if (!contestRunning) {
      socket.emit("submission_result", { message: "Contest is not running!" });
      return;
    }

    const currTime = new Date();
    const submissionData = {
      code: data.code,
      languageId: languagetoIdMap[data.language],
    };

    try {
      const fresponse = await axios.post(
        `http://localhost:8000/api/v1/problem/${data.problemId}/submitcode`,
        submissionData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const verdict = fresponse.data.status.id; //problem status 3 if accepted
      let leaderboard = await Leaderboard.findOne({
        contestId: data.contestId,
      });

      if (!leaderboard) {
        return socket.emit("submission_result", {
          message: "Leaderboard not found!",
        });
      }

      let userEntry = leaderboard.users.find((user) =>
        user.userId.equals(data.userId)
      );

      if (!userEntry) {
        //adds the user if not submitted before
        userEntry = {
          userId: data.userId,
          problemSolved: [],
          score: 0,
        };
        leaderboard.users.push(userEntry);
      }

      let problemEntry = userEntry.problemSolved.find(
        (problem) => problem.problemId === data.problemId
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
        (p) => p.problemId === data.problemId
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
          (submissionTime - leaderboard.contestStartTime) / (1000 * 60)
        );
        let finalScore = problemScore - timeElapsedMinutes;
        userEntry.score += finalScore;
        userEntry.score = Math.max(userEntry.score, problemScore / 4);
      } else {
        // Wrong answer
        problemEntry.rejected.push(submissionRecord);
        userEntry.score -= 50; // hardcoded the wrong submission score
      }
      await leaderboard.save();
      socket.emit("see_output", fresponse.data);
    } catch (error) {
      console.error("Error submitting code:", error);
      socket.emit("submission_result", { message: "Failed to submit code" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", userRoute);
app.use("/api/v1/problem", problemRoute);
app.use("/api/v1/contest", contestRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/blog", blogRoute);

server.listen(PORT, async () => {
  // 🔹 Changed app.listen to server.listen
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});
