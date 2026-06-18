import Event from "../models/Event.js";
import User from "../models/User.js";

const getEvents = async (_req, res) => {
  const events = await Event.find().sort({ startDate: 1, createdAt: -1 });
  res.status(200).json({ events });
};

const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  res.status(200).json({ event });
};

const createEvent = async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json({ event });
};

const updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  res.status(200).json({ event });
};

const deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  await User.updateMany({ eventId: event._id }, { $set: { eventId: null } });
  res.status(200).json({ message: "Event deleted successfully" });
};

export { createEvent, deleteEvent, getEventById, getEvents, updateEvent };
