import express from "express";
import { createContest } from "../controllers/contest.controller.js";

const router = express.Router();
router.route("/").get();
router.route("/:id").get();
router.route("/create").post(createContest);
router.route("/update/:id").put();

export default router;
