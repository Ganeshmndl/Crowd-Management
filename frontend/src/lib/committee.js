const reportStatuses = [
  "pending",
  "under_review",
  "verified",
  "matched",
  "resolved",
  "rejected",
];

const matchStatuses = ["pending", "approved", "rejected", "resolved"];

const formatDate = (value) =>
  value ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value)) : "-";

const formatDateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "-";

const getReporter = (record) => record?.userId?.name || "Unknown reporter";
const getEventName = (record) => record?.eventId?.name || "Assigned event";

export { formatDate, formatDateTime, getEventName, getReporter, matchStatuses, reportStatuses };
