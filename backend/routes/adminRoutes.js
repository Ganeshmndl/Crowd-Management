import { Router } from "express";
import {
  assignCommittee,
  createEvent,
  deleteEvent,
  deleteUser,
  getCommittees,
  getDashboard,
  getEvents,
  getUsers,
  updateEvent,
  updateUser,
} from "../controllers/adminController.js";
import {
  getMapLocations,
  createEventLocation,
  updateEventLocation,
  deleteEventLocation,
} from "../controllers/eventLocationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import { imageUpload } from "../middleware/uploadMiddleware.js";
import { validateEventId } from "../middleware/eventValidationMiddleware.js";

const router = Router();
router.use(protect, requireAdmin);

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/committees", getCommittees);
router.get("/events", getEvents);
router.post("/events", imageUpload.single("banner"), createEvent);
router.patch(
  "/events/:id",
  validateEventId,
  imageUpload.single("banner"),
  updateEvent,
);
router.delete("/events/:id", validateEventId, deleteEvent);
router.patch("/events/:id/assign-committee", validateEventId, assignCommittee);
router.get("/map-locations", getMapLocations);
router.post("/map-locations", createEventLocation);
router.patch("/map-locations/:id", updateEventLocation);
router.delete("/map-locations/:id", deleteEventLocation);

export default router;
