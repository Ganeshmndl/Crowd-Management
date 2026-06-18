import EventLocation from "../models/EventLocation.js";

// Public (get event locations by event ID)
const getEventLocations = async (req, res) => {
  const { eventId } = req.params;
  const locations = await EventLocation.find({ eventId }).sort({
    createdAt: -1,
  });
  res.json({ locations });
};

// Admin routes
const getMapLocations = async (req, res) => {
  const locations = await EventLocation.find()
    .populate("eventId", "name")
    .sort({ createdAt: -1 });
  res.json({ locations });
};

const createEventLocation = async (req, res) => {
  const location = await EventLocation.create({
    ...req.body,
  });
  await location.populate("eventId", "name");
  res.status(201).json({ location });
};

const updateEventLocation = async (req, res) => {
  const { id } = req.params;
  const location = await EventLocation.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).populate("eventId", "name");
  if (!location) {
    res.status(404);
    throw new Error("Location not found");
  }
  res.json({ location });
};

const deleteEventLocation = async (req, res) => {
  const { id } = req.params;
  const location = await EventLocation.findByIdAndDelete(id);
  if (!location) {
    res.status(404);
    throw new Error("Location not found");
  }
  res.json({ message: "Location deleted" });
};

export {
  getEventLocations,
  getMapLocations,
  createEventLocation,
  updateEventLocation,
  deleteEventLocation,
};
