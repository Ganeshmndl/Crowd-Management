import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  validateEventId,
  validateEventPayload,
} from "../middleware/eventValidationMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getEvents);
router.get("/:id", validateEventId, getEventById);
router.post("/", requireAdmin, validateEventPayload, createEvent);
router.put(
  "/:id",
  requireAdmin,
  validateEventId,
  validateEventPayload,
  updateEvent,
);
router.delete("/:id", requireAdmin, validateEventId, deleteEvent);

export default router;
