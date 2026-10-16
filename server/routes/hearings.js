import express from "express";
import {
  getTodaySchedule,
  getTodayStats,
} from "../controllers/hearingController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();
const allowedRoles = authorize("clerk", "judge", "stenographer");

router.get("/today", protect, allowedRoles, getTodaySchedule);
router.get("/stats", protect, allowedRoles, getTodayStats);

export default router;
