import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getJwtSecret } from "../utils/authConfig.js";

const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Authentication token is required");
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    res.status(401);
    throw new Error("Invalid authentication token");
  }

  try {
    const payload = jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });

    if (!payload.id) {
      res.status(401);
      throw new Error("Invalid authentication token");
    }
    const user = await User.findById(payload.id);

    if (!user) {
      res.status(401);
      throw new Error("User account no longer exists");
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error("This account has been disabled");
    }

    req.user = user;
    next();
  } catch (error) {
    if (res.statusCode !== 401) {
      res.status(401);
    }

    if (error.message === "User account no longer exists") {
      throw error;
    }

    throw new Error("Invalid or expired authentication token");
  }
};

export { protect };
