import express from "express";
import {
  contestProblemSubmitCode,
  createContest,
  getContestById,
} from "../controllers/contest.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";

// Export a function that accepts `io` and returns the router
export const contestRoutes = (io) => {
  const router = express.Router();

  // Define routes
  router.route("/").get();
  router.route("/:id").get(getContestById);
  router.route("/create").post((req, res) => createContest(req, res, io)); // Pass `io` to createContest
  router.route("/update/:id").put();

  router.route("/:problemid/submitcode").post(isAuthenticated, contestProblemSubmitCode);

  return router;
};