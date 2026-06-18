import { Router } from "express";
import {
  createMissingReport,
  deleteMissingReport,
  getMissingReport,
  getMissingReports,
  updateMissingReport,
} from "../controllers/missingReportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { imageUpload } from "../middleware/uploadMiddleware.js";
import { validateRecordId } from "../utils/recordHelpers.js";

const router = Router();
router.use(protect);
router.route("/").get(getMissingReports).post(imageUpload.single("photo"), createMissingReport);
router
  .route("/:id")
  .get(validateRecordId, getMissingReport)
  .put(validateRecordId, imageUpload.single("photo"), updateMissingReport)
  .delete(validateRecordId, deleteMissingReport);

export default router;
