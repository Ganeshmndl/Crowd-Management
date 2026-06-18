import Match from "../models/Match.js";
import MissingReport from "../models/MissingReport.js";
import FoundReport from "../models/FoundReport.js";

const getReunificationDetails = async (req, res) => {
  const { ticketId } = req.params;
  const match = await Match.findOne({ ticketId })
    .populate("missingReportId")
    .populate("foundReportId")
    .populate("eventId");
  if (!match) {
    res.status(404);
    throw new Error("Reunification ticket not found");
  }

  const userId = req.user._id.toString();
  const isMissingReporter = match.missingReportId.userId.toString() === userId;
  const isFoundReporter = match.foundReportId.userId.toString() === userId;
  const isCommittee =
    req.user.role === "committee" || req.user.role === "admin";

  // Build response based on privacy rules
  let response = {
    ticketId: match.ticketId,
    reunificationStatus: match.reunificationStatus,
    helpDeskLocation: match.helpDeskLocation,
    committeeContactName: match.committeeContactName,
    committeeContactNumber: match.committeeContactNumber,
  };

  if (isMissingReporter || isCommittee) {
    response.missingPersonName = match.missingReportId.name;
    response.meetingTime = match.meetingTime;
    response.matchNotes = match.matchNotes;
  }

  if (isFoundReporter || isCommittee) {
    // Don't show missing reporter details to found reporter
  }

  if (isCommittee) {
    response.missingReport = match.missingReportId;
    response.foundReport = match.foundReportId;
  }

  res.json({ reunification: response });
};

// Also, let's add an endpoint to get user's reunifications
const getUserReunifications = async (req, res) => {
  const userId = req.user._id;
  // First find all reports for user
  const [missingReports, foundReports] = await Promise.all([
    MissingReport.find({ userId }, "_id"),
    FoundReport.find({ userId }, "_id"),
  ]);
  const missingIds = missingReports.map((r) => r._id);
  const foundIds = foundReports.map((r) => r._id);
  // Find matches where user's report is involved
  const matches = await Match.find({
    $or: [
      { missingReportId: { $in: missingIds } },
      { foundReportId: { $in: foundIds } },
    ],
  })
    .populate("missingReportId", "name")
    .populate("foundReportId", "foundPersonName")
    .sort({ createdAt: -1 });

  res.json({ reunifications: matches });
};

export { getReunificationDetails, getUserReunifications };
