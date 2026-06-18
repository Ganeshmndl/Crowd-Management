import {
  CalendarDays,
  FileSearch,
  HandHeart,
  LoaderCircle,
  MapPin,
  Pencil,
  Siren,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormAlert from "@/components/FormAlert";
import StatusBadge from "@/components/StatusBadge";
import UserModuleLayout from "@/components/UserModuleLayout";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";

const tabs = [
  ["missing", "Missing", FileSearch],
  ["found", "Found", HandHeart],
  ["sos", "SOS", Siren],
];

const endpointFor = {
  missing: "/missing-reports",
  found: "/found-reports",
  sos: "/sos-requests",
};

function MyReportsPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("missing");
  const [records, setRecords] = useState({ missing: [], found: [], sos: [] });
  const [reunifications, setReunifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecords = useCallback(async () => {
    try {
      const [missing, found, sos] = await Promise.all([
        apiRequest("/missing-reports", { headers: { Authorization: `Bearer ${token}` } }),
        apiRequest("/found-reports", { headers: { Authorization: `Bearer ${token}` } }),
        apiRequest("/sos-requests", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      // Try to get reunifications but don't fail the whole load if it fails
      try {
        const reunions = await apiRequest("/reunification/my", { headers: { Authorization: `Bearer ${token}` } });
        setReunifications(reunions.reunifications);
      } catch (reunionErr) {
        console.warn("Failed to load reunifications", reunionErr);
        setReunifications([]);
      }
      setRecords({
        missing: missing.reports,
        found: found.reports,
        sos: sos.requests,
      });
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  useEffect(() => {
    loadRecords()
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [loadRecords]);

  const deleteRecord = async (type, record) => {
    if (!window.confirm("Delete this record permanently?")) return;
    try {
      await apiRequest(`${endpointFor[type]}/${record._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords((current) => ({
        ...current,
        [type]: current[type].filter((item) => item._id !== record._id),
      }));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const getReunificationForReport = (reportId) => {
    return reunifications.find(
      (r) =>
        r.missingReportId?._id === reportId ||
        r.foundReportId?._id === reportId,
    );
  };

  const currentRecords = records[activeTab];

  return (
    <UserModuleLayout
      title="My reports"
      description="Track every report and assistance request for your selected event."
      actions={
        <div className="flex gap-2">
          <Link
            to="/user/missing/new"
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm"
          >
            Missing report
          </Link>
          <Link
            to="/user/found/new"
            className="inline-flex h-10 items-center rounded-xl bg-slate-950 px-4 text-xs font-bold text-white"
          >
            Found report
          </Link>
        </div>
      }
    >
      {error && (
        <div className="mb-5">
          <FormAlert>{error}</FormAlert>
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex overflow-x-auto border-b border-slate-100 px-3 pt-3 sm:px-5">
          {tabs.map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex min-w-max items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                activeTab === key
                  ? "border-slate-950 text-slate-950"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <Icon className="size-4" />
              {label}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px]">
                {records[key].length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid min-h-72 place-items-center">
            <LoaderCircle className="size-7 animate-spin text-brand-600" />
          </div>
        ) : currentRecords.length ? (
          <div className="divide-y divide-slate-100">
            {currentRecords.map((record) => {
              const reunion = getReunificationForReport(record._id);
              return (
                <article
                  key={record._id}
                  className="grid gap-4 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6"
                >
                  {record.photo?.url ? (
                    <img
                      src={record.photo.url}
                      alt=""
                      className="size-16 rounded-xl object-cover"
                    />
                  ) : (
                    <span
                      className={`grid size-12 place-items-center rounded-xl ${activeTab === "sos" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"}`}
                    >
                      {activeTab === "sos" ? (
                        <Siren className="size-5" />
                      ) : (
                        <FileSearch className="size-5" />
                      )}
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-bold text-slate-950">
                        {record.name || record.helpDesk || record.location}
                      </h2>
                      <StatusBadge
                        status={
                          reunion?.reunificationStatus &&
                          reunion.reunificationStatus !== "pending"
                            ? reunion.reunificationStatus
                            : activeTab === "sos"
                              ? record.status
                              : record.reviewStatus
                        }
                      />
                    </div>
                    {reunion && (
                      <div className="mt-2 p-3 rounded-lg bg-brand-50 border border-brand-100">
                        <p className="text-xs text-brand-800">
                          <span className="font-semibold">
                            Ticket #{reunion.ticketId}
                          </span>{" "}
                          · Reunification details available!
                        </p>
                        <Link
                          to={`/user/reunification/${reunion.ticketId}`}
                          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800"
                        >
                          View details
                          <ExternalLink className="size-3" />
                        </Link>
                      </div>
                    )}
                    <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="size-3.5" />
                      {record.lastSeenLocation ||
                        record.foundLocation ||
                        record.location}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <CalendarDays className="size-3.5" />
                      Created{" "}
                      {new Intl.DateTimeFormat("en", {
                        dateStyle: "medium",
                      }).format(new Date(record.createdAt))}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {activeTab !== "sos" && (
                      <Link
                        to={`/user/${activeTab}/${record._id}/edit`}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Link>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => deleteRecord(activeTab, record)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <FileSearch className="mx-auto size-9 text-slate-300" />
            <p className="mt-4 font-semibold text-slate-800">
              No {activeTab} records yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              New submissions will appear here with live status tracking.
            </p>
          </div>
        )}
      </div>
    </UserModuleLayout>
  );
}

export default MyReportsPage;
