import mongoose from "mongoose";
import Event from "../models/Event.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const serializeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  eventId: user.eventId ? user.eventId.toString() : null,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  let user;

  try {
    user = await User.create({ name, email, password });
  } catch (error) {
    if (error?.code === 11000) {
      res.status(409);
      throw new Error("An account with this email already exists");
    }
    throw error;
  }

  res.status(201).json({
    token: generateToken(user),
    user: serializeUser(user),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("This account has been disabled");
  }

  res.status(200).json({
    token: generateToken(user),
    user: serializeUser(user),
  });
};

const getCurrentUser = async (req, res) => {
  res.status(200).json({ user: serializeUser(req.user) });
};

const selectEvent = async (req, res) => {
  const { eventId } = req.body;

  if (!mongoose.isValidObjectId(eventId)) {
    res.status(400);
    throw new Error("A valid eventId is required");
  }

  const event = await Event.findById(eventId);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  if (["completed", "cancelled"].includes(event.status)) {
    res.status(400);
    throw new Error("This event is not available for selection");
  }

  req.user.eventId = event._id;
  await req.user.save();

  res.status(200).json({
    event,
    user: serializeUser(req.user),
  });
};

export { getCurrentUser, loginUser, registerUser, selectEvent };
