import express from "express";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./route/user.route.js";
import problemRoute from "./route/problem.route.js";
import { contestRoutes } from "./route/contest.route.js"; // Import contestRoutes
import adminRoute from "./route/admin.route.js";
import blogRoute from "./route/blog.route.js";
import http from "http";
import { initializeSocket } from "./services/socketService.js";
import { rescheduleAllContests } from "./services/contestScheduler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2000;

const server = http.createServer(app);

const io = initializeSocket(server);

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

let contestRunning = true; // Set contest running state

io.on("connection", (socket) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie || "");
  const token = cookies.token;

  console.log(`User connected: ${socket.id}`);

  if (!contestRunning) {
    socket.emit("contest_not_running", { message: "Contest is not running!" });
    io.emit("contest_ended");
    socket.disconnect(true);
    return;
  }

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

      const verdict = fresponse.data.status.id; // 3 if accepted
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
        userEntry = { userId: data.userId, problemSolved: [], score: 0 };
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
        submissionId: fresponse.data.submissionId,
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
        problemEntry.accepted.push(submissionRecord);
        userEntry.score += problemScore;
      } else {
        problemEntry.rejected.push(submissionRecord);
        userEntry.score -= 50; // Penalty for wrong answer
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
      socket.emit("leaderboard_error", { message: "Contest is not running!" });
      return;
    }

    try {
      const leaderboard = await Leaderboard.findOne({ contestId });
      if (!leaderboard) {
        return socket.emit("leaderboard_error", {
          message: "Leaderboard not found!",
        });
      }

      const leaderboardData = leaderboard.users.map((user) => ({
        userId: user.userId,
        score: user.score,
      }));

      socket.emit("leaderboard_update", leaderboardData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      socket.emit("leaderboard_error", {
        message: "Failed to fetch leaderboard",
      });
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
app.use("/api/v1/contest", contestRoutes(io)); // Pass `io` to contest routes
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/blog", blogRoute);

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();

  rescheduleAllContests(io); // Reschedule contests on server start
});
