import express from "express";
import {
  addRemark,
  approveRojnama,
  createRojnama,
  getRojnama,
  listNeedsCorrectionRojnamas,
  listPendingRojnamas,
  listCaseRojnamas,
  resubmitRojnama,
  submitRojnama,
  updateRojnama,
} from "../controllers/rojnamaController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, authorize("stenographer"), createRojnama);
router.put("/:id", protect, authorize("stenographer"), updateRojnama);
router.patch(
  "/:id/resubmit",
  protect,
  authorize("stenographer"),
  resubmitRojnama,
);
router.patch(
  "/:id/submit",
  protect,
  authorize("stenographer"),
  submitRojnama,
);
router.get("/pending", protect, authorize("clerk"), listPendingRojnamas);
router.get(
  "/needs-correction",
  protect,
  authorize("stenographer"),
  listNeedsCorrectionRojnamas,
);
router.patch("/:id/remarks", protect, authorize("clerk"), addRemark);
router.patch("/:id/approve", protect, authorize("clerk"), approveRojnama);
router.get(
  "/case/:caseId",
  protect,
  authorize("stenographer", "clerk", "judge"),
  listCaseRojnamas,
);
router.get(
  "/:id",
  protect,
  authorize("stenographer", "clerk", "judge"),
  getRojnama,
);

export default router;
