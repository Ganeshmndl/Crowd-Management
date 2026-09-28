import mongoose from "mongoose";
import FoundReport from "../models/FoundReport.js";
import Match from "../models/Match.js";
import MissingReport from "../models/MissingReport.js";
import SOSRequest from "../models/SOSRequest.js";
import {
  escapeRegex,
  parseListQuery,
  requireAssignedEvents,
} from "../utils/committeeHelpers.js";
import { createNotification } from "./notificationController.js";
import { normalizeIndianMobile } from "../utils/validators.js";

const reportModels = {
  missing: MissingReport,
  found: FoundReport,
};
const reviewStatuses = [
  "pending",
  "under_review",
  "verified",
  "matched",
  "resolved",
  "rejected",
];
const matchStatuses = ["pending", "approved", "rejected", "resolved"];

const buildReportFilter = (type, query, eventIds) => {
  const filter = { eventId: { $in: eventIds } };
  if (query.status && reviewStatuses.includes(query.status)) {
    filter.reviewStatus = query.status;
  }
  if (query.eventId && mongoose.isValidObjectId(query.eventId)) {
    const allowed = eventIds.some((id) => id.toString() === query.eventId);
    filter.eventId = allowed ? query.eventId : { $in: [] };
  }
  if (query.search?.trim()) {
    const pattern = new RegExp(escapeRegex(query.search.trim()), "i");
    filter.$or =
      type === "missing"
        ? [
            { name: pattern },
            { lastSeenLocation: pattern },
            { description: pattern },
          ]
        : [
            { foundLocation: pattern },
            { helpDesk: pattern },
            { description: pattern },
          ];
  }
  return filter;
};

const listReports = (type) => async (req, res) => {
  const eventIds = await requireAssignedEvents(req, res);
  const Model = reportModels[type];
  const filter = buildReportFilter(type, req.query, eventIds);
  const { limit, page, skip, sort } = parseListQuery(req.query, [
    "createdAt",
    "age",
    "approxAge",
    "lastSeenDate",
    "reviewStatus",
  ]);

  const [reports, total] = await Promise.all([
    Model.find(filter)
      .populate("userId", "name email")
      .populate("eventId", "name venue district")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Model.countDocuments(filter),
  ]);

  res.json({
    reports,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  });
};

const getDashboard = async (req, res) => {
  const eventIds = await requireAssignedEvents(req, res);
  const [missingCounts, foundCounts, matches, sosRequests] = await Promise.all([
    MissingReport.aggregate([
      { $match: { eventId: { $in: eventIds } } },
      { $group: { _id: "$reviewStatus", count: { $sum: 1 } } },
    ]),
    FoundReport.aggregate([
      { $match: { eventId: { $in: eventIds } } },
      { $group: { _id: "$reviewStatus", count: { $sum: 1 } } },
    ]),
    Match.find({ eventId: { $in: eventIds } })
      .populate("missingReportId", "name photo")
      .populate("foundReportId", "photo helpDesk")
      .sort({ createdAt: -1 }),
    SOSRequest.countDocuments({
      eventId: { $in: eventIds },
      status: { $in: ["active", "responding"] },
    }),
  ]);

  const counts = [...missingCounts, ...foundCounts].reduce((result, item) => {
    result[item._id] = (result[item._id] || 0) + item.count;
    return result;
  }, {});

  res.json({
    kpis: {
      openReports:
        (counts.pending || 0) +
        (counts.under_review || 0) +
        (counts.verified || 0),
      pendingReview: counts.pending || 0,
      matchedCases: matches.filter((match) =>
        ["approved", "resolved"].includes(match.status),
      ).length,
      resolvedCases:
        (counts.resolved || 0) +
        matches.filter((match) => match.status === "resolved").length,
      sosRequests,
    },
    recentMatches: matches.slice(0, 5),
  });
};

const updateReportReview = async (req, res) => {
  const { type, status } = req.body;
  const Model = reportModels[type];

  if (!Model || !reviewStatuses.includes(status)) {
    res.status(400);
    throw new Error("Valid report type and review status are required");
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid report ID");
  }

  const eventIds = await requireAssignedEvents(req, res);
  const report = await Model.findOne({
    _id: req.params.id,
    eventId: { $in: eventIds },
  });
  if (!report) {
    res.status(404);
    throw new Error("Report not found in your assigned events");
  }

  report.reviewStatus = status;
  report.reviewedBy = req.user._id;
  report.reviewedAt = new Date();

  // Sync the status field with reviewStatus
  if (status === "resolved") {
    report.status = type === "missing" ? "closed" : "closed";
  } else if (status === "matched") {
    report.status = type === "missing" ? "found" : "reunited";
  }

  // Verification changes review metadata, not the reporter's phone; preserve legacy stored values.
  await report.save({ validateModifiedOnly: true });
  await report.populate([
    { path: "userId", select: "name email" },
    { path: "eventId", select: "name venue district" },
  ]);
  res.json({ report });
};

const verifyReport = async (req, res) => {
  const status = req.body.decision === "reject" ? "rejected" : "verified";
  req.body.status = status;
  return updateReportReview(req, res);
};

const listSOS = async (req, res) => {
  const eventIds = await requireAssignedEvents(req, res);
  const filter = { eventId: { $in: eventIds } };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.severity) filter.severity = req.query.severity;
  if (req.query.search?.trim()) {
    const pattern = new RegExp(escapeRegex(req.query.search.trim()), "i");
    filter.$or = [{ location: pattern }, { message: pattern }];
  }
  const { limit, page, skip, sort } = parseListQuery(req.query, [
    "createdAt",
    "severity",
    "status",
  ]);
  const [requests, total] = await Promise.all([
    SOSRequest.find(filter)
      .populate("userId", "name email")
      .populate("eventId", "name venue district")
      .populate("assignedCommitteeId", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    SOSRequest.countDocuments(filter),
  ]);
  res.json({
    requests,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  });
};

const updateSOS = async (req, res) => {
  const eventIds = await requireAssignedEvents(req, res);
  const request = await SOSRequest.findOne({
    _id: req.params.id,
    eventId: { $in: eventIds },
  });
  if (!request) {
    res.status(404);
    throw new Error("SOS request not found in your assigned events");
  }

  const oldStatus = request.status;
  if (req.body.action === "assign") {
    request.assignedCommitteeId = req.user._id;
    request.status = "responding";
  } else if (req.body.action === "resolve") {
    request.assignedCommitteeId ||= req.user._id;
    request.status = "resolved";
  } else {
    res.status(400);
    throw new Error("Action must be assign or resolve");
  }
  await request.save();

  // Notify user based on action
  if (request.userId) {
    if (req.body.action === "assign" && oldStatus !== "responding") {
      await createNotification({
        userId: request.userId,
        role: "user",
        title: "SOS Request Accepted",
        message: "A committee member is responding to your SOS request!",
        type: "sos_accepted",
      });
    } else if (req.body.action === "resolve" && oldStatus !== "resolved") {
      await createNotification({
        userId: request.userId,
        role: "user",
        title: "SOS Request Resolved",
        message: "Your SOS request has been marked as resolved.",
        type: "sos_resolved",
      });
    }
  }

  await request.populate([
    { path: "userId", select: "name email" },
    { path: "eventId", select: "name venue district" },
    { path: "assignedCommitteeId", select: "name email" },
  ]);
  res.json({ request });
};

const locationSimilarity = (first, second) => {
  const words = (value) =>
    new Set(
      value
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean),
    );
  const left = words(first);
  const right = words(second);
  const union = new Set([...left, ...right]);
  if (union.size === 0) return 0;
  return [...left].filter((word) => right.has(word)).length / union.size;
};

const calculateMatchScore = (missing, found) => {
  const ageDifference = Math.abs(missing.age - found.approxAge);
  const age = Math.round(Math.max(0, 1 - ageDifference / 20) * 40);
  const gender =
    missing.gender === found.gender ||
    missing.gender === "unknown" ||
    found.gender === "unknown"
      ? 25
      : 0;
  const location = Math.round(
    locationSimilarity(missing.lastSeenLocation, found.foundLocation) * 20,
  );
  const sameEvent =
    missing.eventId.toString() === found.eventId.toString() ? 15 : 0;
  return {
    score: age + gender + location + sameEvent,
    details: { age, gender, location, sameEvent },
  };
};

const createMatch = async (req, res) => {
  const { missingReportId, foundReportId } = req.body;
  if (
    !mongoose.isValidObjectId(missingReportId) ||
    !mongoose.isValidObjectId(foundReportId)
  ) {
    res.status(400);
    throw new Error("Valid missing and found report IDs are required");
  }
  const eventIds = await requireAssignedEvents(req, res);
  const [missing, found] = await Promise.all([
    MissingReport.findOne({ _id: missingReportId, eventId: { $in: eventIds } }),
    FoundReport.findOne({ _id: foundReportId, eventId: { $in: eventIds } }),
  ]);
  if (!missing || !found) {
    res.status(404);
    throw new Error("Both reports must belong to your assigned events");
  }
  if (missing.eventId.toString() !== found.eventId.toString()) {
    res.status(400);
    throw new Error("Reports must belong to the same event");
  }

  const { score, details } = calculateMatchScore(missing, found);
  let match;
  try {
    match = await Match.create({
      missingReportId,
      foundReportId,
      committeeId: req.user._id,
      eventId: missing.eventId,
      matchScore: score,
      scoreDetails: details,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      throw new Error("This report pair has already been matched");
    }
    throw error;
  }
  // Update the reports' reviewStatus and status
  await Promise.all([
    MissingReport.findByIdAndUpdate(missingReportId, {
      reviewStatus: "matched",
      status: "found",
    }),
    FoundReport.findByIdAndUpdate(foundReportId, {
      reviewStatus: "matched",
      status: "reunited",
    }),
  ]);

  // Notify missing report user
  if (missing && missing.userId) {
    await createNotification({
      userId: missing.userId,
      role: "user",
      title: "Missing Report Matched",
      message: `A potential match has been found for ${missing.name}!`,
      type: "missing_matched",
    });
  }

  await match.populate([
    {
      path: "missingReportId",
      populate: { path: "userId", select: "name email" },
    },
    {
      path: "foundReportId",
      populate: { path: "userId", select: "name email" },
    },
    { path: "eventId", select: "name venue district" },
  ]);
  res.status(201).json({ match });
};

const listMatches = async (req, res) => {
  const eventIds = await requireAssignedEvents(req, res);
  const filter = { eventId: { $in: eventIds } };
  if (req.query.status && matchStatuses.includes(req.query.status)) {
    filter.status = req.query.status;
  }
  const { limit, page, skip, sort } = parseListQuery(req.query, [
    "createdAt",
    "matchScore",
    "status",
  ]);
  const [matches, total] = await Promise.all([
    Match.find(filter)
      .populate(
        "missingReportId",
        "name age gender photo lastSeenLocation reviewStatus",
      )
      .populate(
        "foundReportId",
        "approxAge gender photo foundLocation helpDesk reviewStatus",
      )
      .populate("eventId", "name venue district")
      .populate("committeeId", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Match.countDocuments(filter),
  ]);
  res.json({
    matches,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  });
};

const updateMatchStatus = async (req, res) => {
  if (!matchStatuses.includes(req.body.status)) {
    res.status(400);
    throw new Error("Invalid match status");
  }
  const eventIds = await requireAssignedEvents(req, res);
  const match = await Match.findOne({
    _id: req.params.id,
    eventId: { $in: eventIds },
  });
  if (!match) {
    res.status(404);
    throw new Error("Match not found in your assigned events");
  }
  const oldStatus = match.status;
  match.status = req.body.status;
  await match.save();

  if (["approved", "resolved"].includes(match.status)) {
    const reviewStatus = match.status === "resolved" ? "resolved" : "matched";
    const missingStatus = match.status === "resolved" ? "closed" : "found";
    const foundStatus = match.status === "resolved" ? "closed" : "reunited";

    await Promise.all([
      MissingReport.findByIdAndUpdate(match.missingReportId, {
        reviewStatus,
        status: missingStatus,
      }),
      FoundReport.findByIdAndUpdate(match.foundReportId, {
        reviewStatus,
        status: foundStatus,
      }),
    ]);

    // Notify user if just approved
    if (oldStatus !== "approved" && req.body.status === "approved") {
      const missingReport = await MissingReport.findById(match.missingReportId);
      if (missingReport && missingReport.userId) {
        await createNotification({
          userId: missingReport.userId,
          role: "user",
          title: "Match Approved",
          message: `The match for your missing report has been approved!`,
          type: "match_approved",
        });
      }
    }
  }
  await match.populate([
    {
      path: "missingReportId",
      select: "name age gender photo lastSeenLocation reviewStatus",
    },
    {
      path: "foundReportId",
      select: "approxAge gender photo foundLocation helpDesk reviewStatus",
    },
    { path: "eventId", select: "name venue district" },
  ]);
  res.json({ match });
};

const prepareReunification = async (req, res) => {
  const {
    helpDeskLocation,
    committeeContactName,
    committeeContactNumber,
    meetingTime,
    matchNotes,
  } = req.body;
  const eventIds = await requireAssignedEvents(req, res);
  const match = await Match.findOne({
    _id: req.params.id,
    eventId: { $in: eventIds },
  });
  if (!match) {
    res.status(404);
    throw new Error("Match not found in your assigned events");
  }
  // Generate ticket ID: RCC-2026-XXXX
  const year = new Date().getFullYear();
  // Find last ticket for this year
  const lastMatch = await Match.findOne({
    ticketId: { $regex: `^RCC-${year}-` },
  }).sort({ createdAt: -1 });
  let nextNumber = 1001;
  if (lastMatch && lastMatch.ticketId) {
    const parts = lastMatch.ticketId.split("-");
    const lastNumber = parseInt(parts[2], 10);
    nextNumber = lastNumber + 1;
  }
  const ticketId = `RCC-${year}-${nextNumber}`;
  // Update match
  match.ticketId = ticketId;
  match.helpDeskLocation = helpDeskLocation;
  match.committeeContactName = committeeContactName;
  match.committeeContactNumber = normalizeIndianMobile(committeeContactNumber);
  match.meetingTime = new Date(meetingTime);
  match.matchNotes = matchNotes;
  match.reunificationStatus = "awaiting_reunification";
  await match.save();

  // Notify user (safely
  if (match.missingReportId) {
    const missingReport = await MissingReport.findById(match.missingReportId);
    if (missingReport && missingReport.userId) {
      await createNotification({
        userId: missingReport.userId,
        role: "user",
        title: "Reunification Prepared",
        message: `Reunification details have been prepared! Check your matches for ticket ${ticketId}.`,
        type: "reunification_prepared",
      });
    }
  }

  await match.populate([
    "missingReportId",
    "foundReportId",
    "eventId",
    "committeeId",
  ]);
  res.json({ match });
};

export {
  createMatch,
  getDashboard,
  listMatches,
  listReports,
  listSOS,
  updateMatchStatus,
  updateReportReview,
  updateSOS,
  verifyReport,
  prepareReunification,
};
