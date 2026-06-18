import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ notifications });
};

export const markAsRead = async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  res.json({ notification });
};

export const createNotification = async (data) => {
  try {
    return await Notification.create(data);
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};
