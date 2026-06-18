import SOSRequest from "../models/SOSRequest.js";
import Event from "../models/Event.js";
import { requireSelectedEvent } from "../utils/recordHelpers.js";
import { createNotification } from "./notificationController.js";

const fields = ["location", "message", "severity", "status"];
const bodyFields = (body) =>
  Object.fromEntries(
    fields
      .filter((field) => body[field] !== undefined)
      .map((field) => [field, body[field]]),
  );

const getSOSRequests = async (req, res) => {
  const requests = await SOSRequest.find({
    userId: req.user._id,
    eventId: req.user.eventId,
  }).sort({ createdAt: -1 });
  res.json({ requests });
};

const getSOSRequest = async (req, res) => {
  const request = await SOSRequest.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!request) {
    res.status(404);
    throw new Error("SOS request not found");
  }
  res.json({ request });
};

const createSOSRequest = async (req, res) => {
  requireSelectedEvent(req, res);
  const request = await SOSRequest.create({
    ...bodyFields(req.body),
    userId: req.user._id,
    eventId: req.user.eventId,
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
          title: "New SOS Request",
          message: `${req.user.name} submitted an SOS request at your event.`,
          type: "new_sos",
        })
      )
    );
  }

  res.status(201).json({ request });
};

const updateSOSRequest = async (req, res) => {
  const request = await SOSRequest.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!request) {
    res.status(404);
    throw new Error("SOS request not found");
  }
  Object.assign(request, bodyFields(req.body));
  await request.save();
  res.json({ request });
};

const deleteSOSRequest = async (req, res) => {
  const request = await SOSRequest.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!request) {
    res.status(404);
    throw new Error("SOS request not found");
  }
  res.json({ message: "SOS request deleted" });
};

export {
  createSOSRequest,
  deleteSOSRequest,
  getSOSRequest,
  getSOSRequests,
  updateSOSRequest,
};
