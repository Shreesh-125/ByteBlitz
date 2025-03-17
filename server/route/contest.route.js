import express from "express";
import {
  contestProblemSubmitCode,
  createContest,
  getContestById,
} from "../controllers/contest.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";

const router = express.Router();
router.route("/").get();
router.route("/:id").get(getContestById);
router.route("/create").post(createContest);
router.route("/update/:id").put();

router.route("/:problemid/submitcode").post(isAuthenticated,contestProblemSubmitCode);

export default router;
