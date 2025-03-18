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

dotenv.config({});
const app = express();
const PORT = process.env.PORT || 2000;

const server = http.createServer(app);
const io = initializeSocket(server);

app.use(cookieParser());

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOption));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", userRoute);
app.use("/api/v1/problem", problemRoute);
app.use("/api/v1/contest", contestRoutes(io)); // Pass io to contest routes
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/blog", blogRoute);

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
  rescheduleAllContests(io); // Reschedule contests on server start
});
