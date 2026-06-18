import { Router } from "express";
import {
  getReunificationDetails,
  getUserReunifications,
} from "../controllers/reunificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);

router.get("/my", getUserReunifications);
router.get("/:ticketId", getReunificationDetails);

export default router;
