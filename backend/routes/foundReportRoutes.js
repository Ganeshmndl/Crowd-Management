import { Router } from "express";
import {
  createFoundReport,
  deleteFoundReport,
  getFoundReport,
  getFoundReports,
  updateFoundReport,
} from "../controllers/foundReportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { imageUpload } from "../middleware/uploadMiddleware.js";
import { validateRecordId } from "../utils/recordHelpers.js";

const router = Router();
router.use(protect);
router.route("/").get(getFoundReports).post(imageUpload.single("photo"), createFoundReport);
router
  .route("/:id")
  .get(validateRecordId, getFoundReport)
  .put(validateRecordId, imageUpload.single("photo"), updateFoundReport)
  .delete(validateRecordId, deleteFoundReport);

export default router;
