import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CommitteeLayout from "@/components/CommitteeLayout";
import FormAlert from "@/components/FormAlert";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import useAuth from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import { formatDate, getEventName, matchStatuses } from "@/lib/committee";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function CommitteeMatchesPage() {
  const { token } = useAuth();
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [prepForm, setPrepForm] = useState({
    helpDeskLocation: "",
    committeeContactName: "",
    committeeContactNumber: "",
    meetingTime: "",
    matchNotes: "",
  });

  const loadMatches = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams(status ? { status } : {});
    const data = await apiRequest(`/committee/matches?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMatches(data.matches);
    setLoading(false);
  }, [status, token]);

  useEffect(() => {
    loadMatches().catch((requestError) => {
      setError(requestError.message);
      setLoading(false);
    });
  }, [loadMatches]);

  const updateStatus = async (match, nextStatus) => {
    const data = await apiRequest(`/committee/matches/${match._id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: nextStatus }),
    });
    setMatches((current) =>
      current.map((item) => (item._id === match._id ? data.match : item)),
    );
  };

  const prepareReunification = async () => {
    try {
      const data = await apiRequest(
        `/committee/matches/${selectedMatch._id}/prepare-reunification`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(prepForm),
        },
      );
      setMatches((current) =>
        current.map((item) =>
          item._id === selectedMatch._id ? data.match : item,
        ),
      );
      setSelectedMatch(null);
    } catch (err) {
      console.error("Prepare reunification error:", err);
      setError(err.message);
    }
  };

  return (
    <CommitteeLayout
      title="Matched Cases"
      description="Track candidate matches, approvals, rejections, and resolved reunions."
    >
      {error && (
        <div className="mb-5">
          <FormAlert>{error}</FormAlert>
        </div>
      )}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-bold text-slate-950">Case matches</h2>
          <Select
            className="sm:w-52"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            {matchStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
        {loading ? (
          <div className="grid min-h-72 place-items-center">
            <LoaderCircle className="size-7 animate-spin text-brand-600" />
          </div>
        ) : matches.length ? (
          <div className="divide-y divide-slate-100">
            {matches.map((match) => (
              <article
                key={match._id}
                className="grid gap-5 p-5 lg:grid-cols-[1fr_auto_auto] lg:items-center"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <CaseCard
                    label="Missing Report"
                    image={match.missingReportId?.photo?.url}
                    title={match.missingReportId?.name}
                    meta={match.missingReportId?.lastSeenLocation}
                    report={match.missingReportId}
                  />
                  <CaseCard
                    label="Found Report"
                    image={match.foundReportId?.photo?.url}
                    title={`Approx ${match.foundReportId?.approxAge}`}
                    meta={match.foundReportId?.foundLocation}
                    report={match.foundReportId}
                  />
                </div>
                <div className="text-left lg:text-center">
                  <p className="text-3xl font-black tracking-tight text-slate-950">
                    {match.matchScore}%
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {getEventName(match)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDate(match.createdAt)}
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={match.status} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 lg:flex-col">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(match, "approved")}
                  >
                    Approve
                  </Button>
                  {match.status === "approved" && !match.ticketId && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        console.log("prepare clicked", match);
                        setSelectedMatch(match);
                      }}
                    >
                      Prepare Reunification
                    </Button>
                  )}
                  {match.ticketId && (
                    <div className="text-xs font-medium text-brand-700">
                      Ticket: {match.ticketId}
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(match, "resolved")}
                  >
                    Resolve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600"
                    onClick={() => updateStatus(match, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="px-6 py-16 text-center text-sm text-slate-500">
            No matches found.
          </p>
        )}
      </div>

      {/* Prepare Reunification Form */}
      {console.log("selectedMatch state:", selectedMatch)}
      {selectedMatch && (
        <form
          className="mt-8 mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
          onSubmit={(e) => {
            e.preventDefault();
            prepareReunification();
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-950">Prepare Reunification</h2>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSelectedMatch(null)}
            >
              Close
            </Button>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="helpDeskLocation">Help Desk Location</Label>
              <Input
                id="helpDeskLocation"
                name="helpDeskLocation"
                value={prepForm.helpDeskLocation}
                onChange={(e) =>
                  setPrepForm({ ...prepForm, helpDeskLocation: e.target.value })
                }
                placeholder="Gate 2 Lost & Found Center"
                required
              />
            </div>
            <div>
              <Label htmlFor="committeeContactName">
                Committee Contact Name
              </Label>
              <Input
                id="committeeContactName"
                name="committeeContactName"
                value={prepForm.committeeContactName}
                onChange={(e) =>
                  setPrepForm({
                    ...prepForm,
                    committeeContactName: e.target.value,
                  })
                }
                placeholder="Makkar Mela Safety Team"
                required
              />
            </div>
            <div>
              <Label htmlFor="committeeContactNumber">
                Committee Contact Number
              </Label>
              <Input
                id="committeeContactNumber"
                name="committeeContactNumber"
                value={prepForm.committeeContactNumber}
                onChange={(e) =>
                  setPrepForm({
                    ...prepForm,
                    committeeContactNumber: e.target.value,
                  })
                }
                placeholder="98XXXXXXXX"
                required
              />
            </div>
            <div>
              <Label htmlFor="meetingTime">Meeting Time</Label>
              <Input
                id="meetingTime"
                name="meetingTime"
                type="datetime-local"
                value={prepForm.meetingTime}
                onChange={(e) =>
                  setPrepForm({ ...prepForm, meetingTime: e.target.value })
                }
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="matchNotes">Notes (Optional)</Label>
              <Textarea
                id="matchNotes"
                name="matchNotes"
                value={prepForm.matchNotes}
                onChange={(e) =>
                  setPrepForm({ ...prepForm, matchNotes: e.target.value })
                }
                placeholder="Additional instructions"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedMatch(null)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      )}
    </CommitteeLayout>
  );
}

function CaseCard({ image, label, title, meta, report }) {
  const isMissing = label === "Missing Report";
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 p-3">
      {image && (
        <img src={image} alt="" className="size-16 rounded-xl object-cover" />
      )}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 truncate font-bold text-slate-950">
          {(isMissing ? title : report?.foundPersonName) || title || "Report"}
        </p>
        <p className="mt-1 truncate text-xs text-slate-500">{meta}</p>
        {report && (
          <>
            {isMissing && report.contactNumber && (
              <p className="mt-1 text-xs text-slate-600">
                📞 {report.contactNumber}
              </p>
            )}
            {!isMissing && report.foundPersonName && (
              <p className="mt-1 text-xs text-slate-600">
                Found Person: {report.foundPersonName}
              </p>
            )}
            {!isMissing && report.reporterMobile && (
              <p className="mt-1 text-xs text-slate-600">
                📞 {report.reporterMobile}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CommitteeMatchesPage;
