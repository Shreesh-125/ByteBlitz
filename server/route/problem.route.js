import express from "express";
import {
  getPaginatedProblems,
  postProblem,
  getProblemById,
  submitProblem,
} from "../controllers/problem.controller.js";

const router = express.Router();

router.route("/").get(getPaginatedProblems);
router.route("/create").post(postProblem);
router.route("/:id").get(getProblemById);
router.route("/:id/submit").post(submitProblem);

export default router;
