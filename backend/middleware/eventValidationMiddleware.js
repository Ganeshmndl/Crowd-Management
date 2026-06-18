import mongoose from "mongoose";

const statuses = ["upcoming", "active", "completed", "cancelled"];
const textFields = [
  ["name", "Event name", 120],
  ["province", "Province", 80],
  ["district", "District", 80],
  ["venue", "Venue", 160],
];

const validateEventId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid event ID");
  }

  next();
};

const validateEventPayload = (req, res, next) => {
  const isCreate = req.method === "POST";
  const normalized = {};

  for (const [field, label, maxLength] of textFields) {
    if (isCreate || Object.hasOwn(req.body, field)) {
      const value = typeof req.body[field] === "string" ? req.body[field].trim() : "";

      if (!value) {
        res.status(400);
        throw new Error(`${label} is required`);
      }

      if (value.length > maxLength) {
        res.status(400);
        throw new Error(`${label} cannot exceed ${maxLength} characters`);
      }

      normalized[field] = value;
    }
  }

  if (isCreate || Object.hasOwn(req.body, "startDate") || Object.hasOwn(req.body, "date")) {
    const date = new Date(req.body.startDate || req.body.date);

    if (Number.isNaN(date.getTime())) {
      res.status(400);
      throw new Error("Enter a valid event date");
    }

    normalized.startDate = date;
  }

  if (isCreate || Object.hasOwn(req.body, "endDate")) {
    const date = new Date(req.body.endDate || normalized.startDate);

    if (Number.isNaN(date.getTime())) {
      res.status(400);
      throw new Error("Enter a valid event end date");
    }

    normalized.endDate = date;
  }

  if (isCreate || Object.hasOwn(req.body, "capacity")) {
    const capacity = Number(req.body.capacity);

    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 10000000) {
      res.status(400);
      throw new Error("Capacity must be an integer between 1 and 10,000,000");
    }

    normalized.capacity = capacity;
  }

  if (isCreate || Object.hasOwn(req.body, "status")) {
    const status = req.body.status || "upcoming";

    if (!statuses.includes(status)) {
      res.status(400);
      throw new Error(`Status must be one of: ${statuses.join(", ")}`);
    }

    normalized.status = status;
  }

  if (Object.hasOwn(req.body, "description")) {
    const description =
      typeof req.body.description === "string" ? req.body.description.trim() : "";

    if (description.length > 2000) {
      res.status(400);
      throw new Error("Description cannot exceed 2000 characters");
    }

    normalized.description = description;
  }

  if (isCreate || Object.hasOwn(req.body, "committeeIds")) {
    const committeeIds = req.body.committeeIds ?? [];

    if (
      !Array.isArray(committeeIds) ||
      committeeIds.some((id) => !mongoose.isValidObjectId(id))
    ) {
      res.status(400);
      throw new Error("committeeIds must contain valid user IDs");
    }

    normalized.committeeIds = [...new Set(committeeIds.map(String))];
  }

  if (!isCreate && Object.keys(normalized).length === 0) {
    res.status(400);
    throw new Error("Provide at least one event field to update");
  }

  req.body = normalized;
  next();
};

export { validateEventId, validateEventPayload };
