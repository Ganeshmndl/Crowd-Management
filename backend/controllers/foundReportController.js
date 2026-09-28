import FoundReport from "../models/FoundReport.js";
import Event from "../models/Event.js";
import {
  deleteCloudinaryPhoto,
  requireSelectedEvent,
  uploadedPhoto,
} from "../utils/recordHelpers.js";
import { normalizeIndianMobile } from "../utils/validators.js";
import { createNotification } from "./notificationController.js";

const fields = [
  "approxAge",
  "gender",
  "foundLocation",
  "helpDesk",
  "foundPersonName",
  "reporterMobile",
  "description",
  "status",
];
const bodyFields = (body) =>
  Object.fromEntries(
    fields
      .filter((field) => body[field] !== undefined)
      .map((field) => [
        field,
        field === "reporterMobile"
          ? normalizeIndianMobile(body[field])
          : body[field],
      ]),
  );

const getFoundReports = async (req, res) => {
  const reports = await FoundReport.find({
    userId: req.user._id,
    eventId: req.user.eventId,
  }).sort({ createdAt: -1 });
  res.json({ reports });
};

const getFoundReport = async (req, res) => {
  const report = await FoundReport.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!report) {
    res.status(404);
    throw new Error("Found report not found");
  }
  res.json({ report });
};

const createFoundReport = async (req, res) => {
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

    const report = await FoundReport.create({
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
            title: "New Found Report",
            message: `${req.user.name} submitted a found report at your event.`,
            type: "new_found",
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

const updateFoundReport = async (req, res) => {
  const report = await FoundReport.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!report) {
    res.status(404);
    throw new Error("Found report not found");
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

const deleteFoundReport = async (req, res) => {
  const report = await FoundReport.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!report) {
    res.status(404);
    throw new Error("Found report not found");
  }
  await deleteCloudinaryPhoto(report.photo);
  res.json({ message: "Found report deleted" });
};

export {
  createFoundReport,
  deleteFoundReport,
  getFoundReport,
  getFoundReports,
  updateFoundReport,
};
