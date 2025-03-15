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

dotenv.config({});
const app = express();
const PORT = process.env.PORT || 2000;

//  Create HTTP server for WebSockets
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
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
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // if (!contestRunning) {
  //   socket.emit("contest_not_running", { message: "Contest is not running!" });
  //   io.emit("contest_ended");
  //   socket.disconnect(true);
  //   return;
  // }

  socket.on("submit_code", async (data) => {
    if (!contestRunning) {
      socket.emit("submission_result", { message: "Contest is not running!" });
      return;
    }
    const submissionData = {
      source_code: data.code,
      language_id: 63,
      number_of_runs: 1,
    };

    const response1 = await axios.post(
      "http://localhost:2358/submissions?base64_encoded=false&wait=true",
      submissionData
    );

    if (!response1.data || !response1.data.token) {
      return res
        .status(500)
        .json({ message: "Failed to submit code", success: false });
    }

    await new Promise((resolve) => setTimeout(resolve, 1 * 1000));

    const response2 = await axios.get(
      `http://localhost:2358/submissions/${response1.data.token}?base64_encoded=false&wait=false`
    );

    // console.log(response2.data);

    socket.emit("see_output", response2.data);

    // // Simulating correct submission
    // let points = 10;
    // leaderboard[data.userId] = (leaderboard[data.userId] || 0) + points;

    // io.emit("leaderboard_update", leaderboard);
    // socket.emit("submission_result", { message: "Submission successful!" });
  });

  // socket.on("disconnect", () => {
  //   console.log(`User disconnected: ${socket.id}`);
  // });
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
