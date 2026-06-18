import { Router } from "express";
import {
  createSOSRequest,
  deleteSOSRequest,
  getSOSRequest,
  getSOSRequests,
  updateSOSRequest,
} from "../controllers/sosRequestController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRecordId } from "../utils/recordHelpers.js";

const router = Router();
router.use(protect);
router.route("/").get(getSOSRequests).post(createSOSRequest);
router
  .route("/:id")
  .get(validateRecordId, getSOSRequest)
  .put(validateRecordId, updateSOSRequest)
  .delete(validateRecordId, deleteSOSRequest);

export default router;
