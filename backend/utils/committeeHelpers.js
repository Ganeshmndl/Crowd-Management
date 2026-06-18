import Event from "../models/Event.js";

const getAssignedEventIds = async (committeeId) => {
  const events = await Event.find({ committeeIds: committeeId }).select("_id");
  return events.map((event) => event._id);
};

const requireAssignedEvents = async (req, res) => {
  const eventIds = await getAssignedEventIds(req.user._id);

  if (eventIds.length === 0) {
    res.status(403);
    throw new Error("No events are assigned to this committee account");
  }

  return eventIds;
};

const parseListQuery = (query, allowedSortFields) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(query.limit, 10) || 10));
  const sortField = allowedSortFields.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";
  const sortOrder = query.order === "asc" ? 1 : -1;

  return { limit, page, skip: (page - 1) * limit, sort: { [sortField]: sortOrder } };
};

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export { escapeRegex, getAssignedEventIds, parseListQuery, requireAssignedEvents };
