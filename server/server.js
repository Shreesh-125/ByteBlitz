import express from "express";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./route/user.route.js";
import problemRoute from "./route/problem.route.js";
import contestRoute from "./route/contest.route.js";
import adminRoute from "./route/admin.route.js";
import blogRoute from "./route/blog.route.js";
import http from "http";  // 🔹 Added for WebSockets
import { Server } from "socket.io";  // 🔹 Added for WebSockets

dotenv.config({});
const app = express();
const PORT = process.env.PORT || 2000;

const server = http.createServer(app); // 🔹 Create HTTP server for WebSockets
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

// 🔹 Contest State Management
let contestRunning = false;
let leaderboard = {};


// 🔹 Start Contest
app.post("/api/v1/contest/start", (req, res) => {
  contestRunning = true;
  console.log("Contest started!");
  io.emit("contest_started");
  res.json({ message: "Contest started!" });
});

// 🔹 Stop Contest
app.post("/api/v1/contest/stop", (req, res) => {
  contestRunning = false;
  console.log("Contest ended!");
  io.emit("contest_ended");
  res.json({ message: "Contest ended!" });
});

// 🔹 WebSocket Logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  if (!contestRunning) {
    socket.disconnect(true);
    return;
  }

  socket.on("submit_code", (data) => {
    console.log(`Code received from ${data.userId} for Problem ${data.problemId}`);

    // Simulating correct submission
    let points = 10; 
    leaderboard[data.userId] = (leaderboard[data.userId] || 0) + points;

    io.emit("leaderboard_update", leaderboard);
    socket.emit("submission_result", { message: "Submission successful!" });
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

server.listen(PORT, async () => {  // 🔹 Changed app.listen to server.listen
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});
