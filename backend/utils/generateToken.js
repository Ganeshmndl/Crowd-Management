import jwt from "jsonwebtoken";
import { getJwtSecret } from "./authConfig.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    getJwtSecret(),
    { algorithm: "HS256", expiresIn: "7d" },
  );
};

export default generateToken;
