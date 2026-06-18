import { Router } from "express";
import {
  createFamilyMember,
  deleteFamilyMember,
  getFamilyMember,
  getFamilyMembers,
  updateFamilyMember,
} from "../controllers/familyMemberController.js";
import { protect } from "../middleware/authMiddleware.js";
import { imageUpload } from "../middleware/uploadMiddleware.js";
import { validateRecordId } from "../utils/recordHelpers.js";

const router = Router();
router.use(protect);
router.route("/").get(getFamilyMembers).post(imageUpload.single("photo"), createFamilyMember);
router
  .route("/:id")
  .get(validateRecordId, getFamilyMember)
  .put(validateRecordId, imageUpload.single("photo"), updateFamilyMember)
  .delete(validateRecordId, deleteFamilyMember);

export default router;
