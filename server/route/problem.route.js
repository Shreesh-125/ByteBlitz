import express from "express";
import {
  getPaginatedProblems,
  postProblem,
  getProblemById,
  updateProblem,
} from "../controllers/problem.controller.js";

const router = express.Router();

router.route("/").get(getPaginatedProblems);
router.route("/create").post(postProblem);
router.route("/:id").get(getProblemById);
router.route("/update/:id").put(updateProblem);
// router.route("/:id/submit").post(submitProblem);

export default router;
