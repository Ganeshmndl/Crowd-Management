import { Router } from "express";
import {
  getEventLocations,
} from "../controllers/eventLocationController.js";

const router = Router();

router.get("/event/:eventId", getEventLocations);

export default router;
