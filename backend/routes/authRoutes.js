import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  selectEvent,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  validateLogin,
  validateRegister,
} from "../middleware/validationMiddleware.js";

const router = Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/me", protect, getCurrentUser);
router.put("/select-event", protect, selectEvent);

export default router;
