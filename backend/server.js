import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import familyMemberRoutes from "./routes/familyMemberRoutes.js";
import foundReportRoutes from "./routes/foundReportRoutes.js";
import missingReportRoutes from "./routes/missingReportRoutes.js";
import sosRequestRoutes from "./routes/sosRequestRoutes.js";
import committeeRoutes from "./routes/committeeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reunificationRoutes from "./routes/reunificationRoutes.js";
import eventLocationRoutes from "./routes/eventLocationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { validateEnvironment } from "./utils/env.js";

validateEnvironment();

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/missing-reports", missingReportRoutes);
app.use("/api/found-reports", foundReportRoutes);
app.use("/api/family-members", familyMemberRoutes);
app.use("/api/sos-requests", sosRequestRoutes);
app.use("/api/committee", committeeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reunification", reunificationRoutes);
app.use("/api/map", eventLocationRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  if (process.env.MONGODB_URI) {
    await connectDB();
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("MONGODB_URI is required in production");
  } else {
    console.warn(
      "MongoDB connection skipped: add MONGODB_URI to backend/.env to connect Atlas.",
    );
  }

  const server = app.listen(port, () => {
    console.log(`CrowdCare API listening on http://localhost:${port}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully.`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  return server;
};

const isMainModule =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMainModule) {
  startServer().catch((error) => {
    console.error(`Failed to start CrowdCare API: ${error.message}`);
    process.exit(1);
  });
}

export { app, startServer };
