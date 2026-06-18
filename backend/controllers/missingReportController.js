import MissingReport from "../models/MissingReport.js";
import Event from "../models/Event.js";
import {
  deleteCloudinaryPhoto,
  requireSelectedEvent,
  uploadedPhoto,
} from "../utils/recordHelpers.js";
import { createNotification } from "./notificationController.js";

const fields = [
  "name",
  "age",
  "gender",
  "contactNumber",
  "secondaryContactNumber",
  "lastSeenLocation",
  "lastSeenDate",
  "description",
  "status",
];

const bodyFields = (body) =>
  Object.fromEntries(
    fields
      .filter((field) => body[field] !== undefined)
      .map((field) => [field, body[field]]),
  );

const sanitizeReport = (report, userRole) => {
  if (userRole !== "committee" && userRole !== "admin") {
    report = report.toObject();
    delete report.contactNumber;
    delete report.secondaryContactNumber;
  }
  return report;
};

const getMissingReports = async (req, res) => {
  const reports = await MissingReport.find({
    userId: req.user._id,
    eventId: req.user.eventId,
  }).sort({ createdAt: -1 });
  const sanitizedReports = reports.map((report) =>
    sanitizeReport(report, req.user.role),
  );
  res.json({ reports: sanitizedReports });
};

const getMissingReport = async (req, res) => {
  const report = await MissingReport.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!report) {
    res.status(404);
    throw new Error("Missing report not found");
  }
  const sanitizedReport = sanitizeReport(report, req.user.role);
  res.json({ report: sanitizedReport });
};

const createMissingReport = async (req, res) => {
  requireSelectedEvent(req, res);
  const photo = uploadedPhoto(req.file);
  if (!photo) {
    res.status(400);
    throw new Error("Photo is required");
  }

  try {
    let faceDescriptor = null;
    if (req.body.faceDescriptor) {
      try {
        faceDescriptor = JSON.parse(req.body.faceDescriptor);
      } catch (e) {
        faceDescriptor = null;
      }
    }

    const report = await MissingReport.create({
      ...bodyFields(req.body),
      photo,
      userId: req.user._id,
      eventId: req.user.eventId,
      faceDescriptor,
    });

    // Get event to find committee members
    const event = await Event.findById(req.user.eventId);
    if (event && event.committeeIds && event.committeeIds.length > 0) {
      // Notify all committee members
      await Promise.all(
        event.committeeIds.map((committeeId) =>
          createNotification({
            userId: committeeId,
            role: "committee",
            title: "New Missing Report",
            message: `${req.user.name} reported ${report.name} as missing at your event.`,
            type: "new_missing",
          }),
        ),
      );
    }

    res.status(201).json({ report });
  } catch (error) {
    await deleteCloudinaryPhoto(photo);
    throw error;
  }
};

const updateMissingReport = async (req, res) => {
  const report = await MissingReport.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!report) {
    res.status(404);
    throw new Error("Missing report not found");
  }

  const oldPhoto = report.photo?.toObject?.() || report.photo;
  Object.assign(report, bodyFields(req.body));
  if (req.file) report.photo = uploadedPhoto(req.file);
  
  if (req.body.faceDescriptor) {
    try {
      report.faceDescriptor = JSON.parse(req.body.faceDescriptor);
    } catch (e) {
      report.faceDescriptor = null;
    }
  } else if (req.file) {
    report.faceDescriptor = null;
  }

  try {
    await report.save();
    if (req.file) await deleteCloudinaryPhoto(oldPhoto);
    res.json({ report });
  } catch (error) {
    if (req.file) await deleteCloudinaryPhoto(report.photo);
    throw error;
  }
};

const deleteMissingReport = async (req, res) => {
  const report = await MissingReport.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!report) {
    res.status(404);
    throw new Error("Missing report not found");
  }
  await deleteCloudinaryPhoto(report.photo);
  res.json({ message: "Missing report deleted" });
};

export {
  createMissingReport,
  deleteMissingReport,
  getMissingReport,
  getMissingReports,
  updateMissingReport,
};
