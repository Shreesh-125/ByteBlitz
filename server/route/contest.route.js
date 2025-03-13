import express from "express";
import {
  createContest,
  getContestById,
} from "../controllers/contest.controller.js";

const router = express.Router();
router.route("/").get();
router.route("/:id").get(getContestById);
router.route("/create").post(createContest);
router.route("/update/:id").put();

export default router;
