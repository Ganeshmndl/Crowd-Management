import { Router } from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);

export default router;
