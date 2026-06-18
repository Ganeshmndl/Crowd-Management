import { Router } from "express";
import {
  createMatch,
  getDashboard,
  listMatches,
  listReports,
  listSOS,
  updateMatchStatus,
  updateReportReview,
  updateSOS,
  verifyReport,
  prepareReunification,
} from "../controllers/committeeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireCommitteeOnly } from "../middleware/roleMiddleware.js";

const router = Router();
router.use(protect, requireCommitteeOnly);

router.get("/dashboard", getDashboard);
router.get("/missing-reports", listReports("missing"));
router.get("/found-reports", listReports("found"));
router.get("/sos", listSOS);
router.patch("/sos/:id", updateSOS);
router.get("/matches", listMatches);
router.post("/matches", createMatch);
router.patch("/matches/:id/status", updateMatchStatus);
router.patch("/matches/:id/prepare-reunification", prepareReunification);
router.patch("/report/:id/verify", verifyReport);
router.patch("/report/:id/status", updateReportReview);

export default router;
