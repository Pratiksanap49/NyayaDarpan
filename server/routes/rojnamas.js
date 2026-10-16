import express from "express";
import {
  createRojnama,
  getRojnama,
  submitRojnama,
  updateRojnama,
} from "../controllers/rojnamaController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, authorize("stenographer"), createRojnama);
router.put("/:id", protect, authorize("stenographer"), updateRojnama);
router.patch(
  "/:id/submit",
  protect,
  authorize("stenographer"),
  submitRojnama,
);
router.get(
  "/:id",
  protect,
  authorize("stenographer", "clerk", "judge"),
  getRojnama,
);

export default router;
