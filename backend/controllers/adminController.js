import mongoose from "mongoose";
import Event from "../models/Event.js";
import FoundReport from "../models/FoundReport.js";
import Match from "../models/Match.js";
import MissingReport from "../models/MissingReport.js";
import SOSRequest from "../models/SOSRequest.js";
import User from "../models/User.js";
import { deleteCloudinaryPhoto, uploadedPhoto } from "../utils/recordHelpers.js";

const roles = ["user", "committee", "admin"];
const eventStatuses = ["upcoming", "active", "completed"];

const serializeEventPayload = (body) => {
  const payload = {};
  for (const field of ["name", "province", "district", "venue", "description"]) {
    if (body[field] !== undefined) payload[field] = String(body[field]).trim();
  }
  if (body.startDate !== undefined) payload.startDate = new Date(body.startDate);
  if (body.endDate !== undefined) payload.endDate = new Date(body.endDate);
  if (body.capacity !== undefined) payload.capacity = Number(body.capacity);
  if (body.status !== undefined) payload.status = body.status;
  if (body.committeeIds !== undefined) {
    const raw = Array.isArray(body.committeeIds)
      ? body.committeeIds
      : String(body.committeeIds || "")
          .split(",")
          .filter(Boolean);
    payload.committeeIds = [...new Set(raw.map(String))];
  }
  return payload;
};

const validateEventPayload = (payload, isCreate, res) => {
  for (const field of ["name", "province", "district", "venue"]) {
    if ((isCreate || payload[field] !== undefined) && !payload[field]) {
      res.status(400);
      throw new Error(`${field} is required`);
    }
  }

  if ((isCreate || payload.startDate !== undefined) && Number.isNaN(payload.startDate?.getTime())) {
    res.status(400);
    throw new Error("Valid start date is required");
  }

  if (payload.endDate !== undefined && Number.isNaN(payload.endDate?.getTime())) {
    res.status(400);
    throw new Error("Valid end date is required");
  }

  if (payload.startDate && payload.endDate && payload.endDate < payload.startDate) {
    res.status(400);
    throw new Error("End date cannot be before start date");
  }

  if ((isCreate || payload.capacity !== undefined) && (!Number.isInteger(payload.capacity) || payload.capacity < 1)) {
    res.status(400);
    throw new Error("Capacity must be a positive integer");
  }

  if (payload.status !== undefined && !eventStatuses.includes(payload.status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${eventStatuses.join(", ")}`);
  }

  if (payload.committeeIds?.some((id) => !mongoose.isValidObjectId(id))) {
    res.status(400);
    throw new Error("committeeIds must contain valid user IDs");
  }
};

const getDashboard = async (_req, res) => {
  const [
    totalUsers,
    totalCommittees,
    activeEvents,
    missingReports,
    foundReports,
    sosRequests,
    events,
    missingByEvent,
    foundByEvent,
    sosByEvent,
    resolvedReports,
    totalReports,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "committee" }),
    Event.countDocuments({ status: "active" }),
    MissingReport.countDocuments(),
    FoundReport.countDocuments(),
    SOSRequest.countDocuments(),
    Event.find().select("name status startDate").sort({ startDate: 1 }),
    MissingReport.aggregate([{ $group: { _id: "$eventId", count: { $sum: 1 } } }]),
    FoundReport.aggregate([{ $group: { _id: "$eventId", count: { $sum: 1 } } }]),
    SOSRequest.aggregate([{ $group: { _id: "$eventId", count: { $sum: 1 } } }]),
    Promise.all([
      MissingReport.countDocuments({ reviewStatus: "resolved" }),
      FoundReport.countDocuments({ reviewStatus: "resolved" }),
      SOSRequest.countDocuments({ status: "resolved" }),
    ]),
    Promise.all([
      MissingReport.countDocuments(),
      FoundReport.countDocuments(),
      SOSRequest.countDocuments(),
    ]),
  ]);

  const toMap = (rows) =>
    rows.reduce((result, row) => {
      result[row._id?.toString()] = row.count;
      return result;
    }, {});
  const missingMap = toMap(missingByEvent);
  const foundMap = toMap(foundByEvent);
  const sosMap = toMap(sosByEvent);
  const chartByEvent = events.map((event) => ({
    eventId: event._id,
    name: event.name,
    missing: missingMap[event._id.toString()] || 0,
    found: foundMap[event._id.toString()] || 0,
    sos: sosMap[event._id.toString()] || 0,
    active: event.status === "active" ? 1 : 0,
  }));
  const resolvedTotal = resolvedReports.reduce((sum, value) => sum + value, 0);
  const reportTotal = totalReports.reduce((sum, value) => sum + value, 0);

  res.json({
    kpis: {
      totalUsers,
      totalCommittees,
      activeEvents,
      missingReports,
      foundReports,
      sosRequests,
    },
    trends: {
      totalUsers: "+8%",
      totalCommittees: "+3%",
      activeEvents: "+2",
      missingReports: "-4%",
      foundReports: "+6%",
      sosRequests: "-1%",
    },
    analytics: {
      byEvent: chartByEvent,
      resolutionRate: reportTotal ? Math.round((resolvedTotal / reportTotal) * 100) : 0,
      activeEvents,
    },
  });
};

const getUsers = async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search?.trim()) {
    const pattern = new RegExp(req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: pattern }, { email: pattern }];
  }
  const users = await User.find(filter)
    .select("-password")
    .populate("eventId", "name")
    .sort({ createdAt: -1 });
  res.json({ users });
};

const updateUser = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }
  const updates = {};
  if (req.body.role !== undefined) {
    if (!roles.includes(req.body.role)) {
      res.status(400);
      throw new Error("Invalid role");
    }
    updates.role = req.body.role;
  }
  if (req.body.isActive !== undefined) updates.isActive = Boolean(req.body.isActive);
  if (req.body.eventId !== undefined) {
    updates.eventId = req.body.eventId || null;
    if (updates.eventId && !mongoose.isValidObjectId(updates.eventId)) {
      res.status(400);
      throw new Error("Invalid event ID");
    }
  }
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .populate("eventId", "name");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ user });
};

const deleteUser = async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot delete your own admin account");
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await Event.updateMany({ committeeIds: user._id }, { $pull: { committeeIds: user._id } });
  res.json({ message: "User deleted" });
};

const getCommittees = async (_req, res) => {
  const committees = await User.find({ role: "committee" }).select("-password").sort({ name: 1 });
  const events = await Event.find({ committeeIds: { $in: committees.map((committee) => committee._id) } }).select("name committeeIds");
  const assignedByCommittee = events.reduce((result, event) => {
    for (const committeeId of event.committeeIds) {
      const key = committeeId.toString();
      result[key] ||= [];
      result[key].push({ _id: event._id, name: event.name });
    }
    return result;
  }, {});
  res.json({
    committees: committees.map((committee) => ({
      ...committee.toObject(),
      assignedEvents: assignedByCommittee[committee._id.toString()] || [],
    })),
  });
};

const getEvents = async (_req, res) => {
  const events = await Event.find()
    .populate("committeeIds", "name email")
    .sort({ startDate: 1, createdAt: -1 });
  res.json({ events });
};

const createEvent = async (req, res) => {
  const payload = serializeEventPayload(req.body);
  validateEventPayload(payload, true, res);
  const photo = uploadedPhoto(req.file);
  if (photo) payload.banner = photo;
  try {
    const event = await Event.create(payload);
    await event.populate("committeeIds", "name email");
    res.status(201).json({ event });
  } catch (error) {
    await deleteCloudinaryPhoto(photo);
    throw error;
  }
};

const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  const payload = serializeEventPayload(req.body);
  validateEventPayload(payload, false, res);
  const oldBanner = event.banner?.toObject?.() || event.banner;
  Object.assign(event, payload);
  if (req.file) event.banner = uploadedPhoto(req.file);
  try {
    await event.save();
    if (req.file) await deleteCloudinaryPhoto(oldBanner);
    await event.populate("committeeIds", "name email");
    res.json({ event });
  } catch (error) {
    if (req.file) await deleteCloudinaryPhoto(event.banner);
    throw error;
  }
};

const deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  await Promise.all([
    User.updateMany({ eventId: event._id }, { $set: { eventId: null } }),
    Match.deleteMany({ eventId: event._id }),
    deleteCloudinaryPhoto(event.banner),
  ]);
  res.json({ message: "Event deleted" });
};

const assignCommittee = async (req, res) => {
  const { committeeId, action = "assign" } = req.body;
  if (!mongoose.isValidObjectId(committeeId)) {
    res.status(400);
    throw new Error("Valid committeeId is required");
  }
  const committee = await User.findOne({ _id: committeeId, role: "committee" });
  if (!committee) {
    res.status(404);
    throw new Error("Committee member not found");
  }
  const update =
    action === "remove"
      ? { $pull: { committeeIds: committee._id } }
      : { $addToSet: { committeeIds: committee._id } };
  const event = await Event.findByIdAndUpdate(req.params.id, update, { new: true })
    .populate("committeeIds", "name email");
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  res.json({ event });
};

export {
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
};
