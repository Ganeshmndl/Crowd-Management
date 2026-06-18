import { CheckCircle2, GitCompareArrows, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CommitteeLayout from "@/components/CommitteeLayout";
import FormAlert from "@/components/FormAlert";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import useAuth from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import { compareFaceDescriptors, loadFaceModels } from "@/lib/faceUtils";

const labelForMissing = (report) =>
  `${report.name} · age ${report.age} · ${report.lastSeenLocation}`;
const labelForFound = (report) =>
  `Approx ${report.approxAge} · ${report.foundLocation} · ${report.helpDesk}`;

function CommitteeMatchCenterPage() {
  const { token } = useAuth();
  const [missingReports, setMissingReports] = useState([]);
  const [foundReports, setFoundReports] = useState([]);
  const [missingId, setMissingId] = useState("");
  const [foundId, setFoundId] = useState("");
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFaceModels();
  }, []);

  useEffect(() => {
    Promise.all([
      apiRequest("/committee/missing-reports?limit=50&status=verified", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      apiRequest("/committee/found-reports?limit=50&status=verified", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([missing, found]) => {
        setMissingReports(missing.reports);
        setFoundReports(found.reports);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [token]);

  const selectedPair = useMemo(
    () => ({
      missing: missingReports.find((report) => report._id === missingId),
      found: foundReports.find((report) => report._id === foundId),
    }),
    [foundId, foundReports, missingId, missingReports],
  );

  const faceSimilarity = useMemo(() => {
    if (!selectedPair.missing || !selectedPair.found) return null;
    return compareFaceDescriptors(
      selectedPair.missing.faceDescriptor,
      selectedPair.found.faceDescriptor,
    );
  }, [selectedPair]);

  const autoSuggestions = useMemo(() => {
    if (missingReports.length === 0 || foundReports.length === 0) return [];

    const suggestions = [];
    for (const missing of missingReports) {
      for (const found of foundReports) {
        const similarity = compareFaceDescriptors(
          missing.faceDescriptor,
          found.faceDescriptor,
        );
        if (similarity !== null) {
          suggestions.push({
            missing,
            found,
            similarity,
          });
        }
      }
    }

    return suggestions.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }, [missingReports, foundReports]);

  const createMatch = async () => {
    setSubmitting(true);
    setError("");
    try {
      const data = await apiRequest("/committee/matches", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          missingReportId: missingId,
          foundReportId: foundId,
        }),
      });
      setMatch(data.match);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateMatch = async (status) => {
    const data = await apiRequest(`/committee/matches/${match._id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setMatch(data.match);
  };

  return (
    <CommitteeLayout
      title="Match Center"
      description="Manually compare verified missing and found reports, then approve or reject candidate matches."
    >
      {error && (
        <div className="mb-5">
          <FormAlert>{error}</FormAlert>
        </div>
      )}
      {loading ? (
        <div className="grid min-h-72 place-items-center">
          <LoaderCircle className="size-7 animate-spin text-brand-600" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-purple-50 text-purple-600">
                  <GitCompareArrows className="size-5" />
                </span>
                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  Create candidate match
                </h2>
                <div className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Missing report
                    </label>
                    <Select
                      value={missingId}
                      onChange={(event) => setMissingId(event.target.value)}
                    >
                      <option value="">Select verified missing report</option>
                      {missingReports.map((report) => (
                        <option key={report._id} value={report._id}>
                          {labelForMissing(report)}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Found report
                    </label>
                    <Select
                      value={foundId}
                      onChange={(event) => setFoundId(event.target.value)}
                    >
                      <option value="">Select verified found report</option>
                      {foundReports.map((report) => (
                        <option key={report._id} value={report._id}>
                          {labelForFound(report)}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Button
                    className="w-full"
                    disabled={!missingId || !foundId || submitting}
                    onClick={createMatch}
                  >
                    {submitting && (
                      <LoaderCircle className="size-4 animate-spin" />
                    )}
                    Generate match score
                  </Button>
                </div>
              </CardContent>
            </Card>

            {autoSuggestions.length > 0 && (
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-sm font-bold text-slate-700">
                    Auto-match suggestions
                  </h3>
                  <div className="mt-4 space-y-3">
                    {autoSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-950">
                            {suggestion.missing.name} ↔{" "}
                            {suggestion.found.foundPersonName ||
                              `Approx ${suggestion.found.approxAge}`}
                          </p>
                          <p className="text-sm font-bold text-purple-700">
                            Face match: {suggestion.similarity}%
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setMissingId(suggestion.missing._id);
                            setFoundId(suggestion.found._id);
                          }}
                        >
                          Use this pair
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h2 className="font-bold text-slate-950">Comparison</h2>
              {selectedPair.missing && selectedPair.found ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <ReportPreview
                    title="Missing"
                    report={selectedPair.missing}
                  />
                  <ReportPreview title="Found" report={selectedPair.found} />
                </div>
              ) : (
                <p className="mt-8 rounded-2xl border border-dashed border-slate-300 py-12 text-center text-sm text-slate-500">
                  Select one missing report and one found report to compare.
                </p>
              )}

              {faceSimilarity !== null && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-700">
                    Face similarity
                  </p>
                  <p className="text-2xl font-black text-slate-950">
                    {faceSimilarity}%
                  </p>
                </div>
              )}

              {match && (
                <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-purple-700">
                        Match score
                      </p>
                      <p className="mt-1 text-4xl font-black tracking-tight text-purple-950">
                        {match.matchScore}%
                      </p>
                    </div>
                    <StatusBadge status={match.status} />
                  </div>
                  <div className="mt-5 grid gap-2 text-xs font-bold text-purple-900 sm:grid-cols-4">
                    <span>Age {match.scoreDetails.age}</span>
                    <span>Gender {match.scoreDetails.gender}</span>
                    <span>Location {match.scoreDetails.location}</span>
                    <span>Same event {match.scoreDetails.sameEvent}</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button onClick={() => updateMatch("approved")}>
                      <CheckCircle2 className="size-4" />
                      Approve Match
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => updateMatch("rejected")}
                    >
                      Reject Match
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </CommitteeLayout>
  );
}

function ReportPreview({ title, report }) {
  const isMissing = title === "Missing";
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      {report.photo?.url && (
        <img
          src={report.photo.url}
          alt=""
          className="aspect-[4/3] w-full rounded-xl object-cover"
        />
      )}
      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
        {title}
      </p>
      <p className="mt-1 font-bold text-slate-950">
        {report.name ||
          report.foundPersonName ||
          `${report.approxAge} years approx`}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {report.lastSeenLocation || report.foundLocation}
      </p>
      {isMissing && report.contactNumber && (
        <p className="mt-1 text-sm text-slate-600">📞 {report.contactNumber}</p>
      )}
      {isMissing && report.secondaryContactNumber && (
        <p className="mt-1 text-sm text-slate-600">
          📞 {report.secondaryContactNumber}
        </p>
      )}
      {!isMissing && report.foundPersonName && (
        <p className="mt-1 text-sm text-slate-600">
          Found Person: {report.foundPersonName}
        </p>
      )}
      {!isMissing && report.reporterMobile && (
        <p className="mt-1 text-sm text-slate-600">
          📞 {report.reporterMobile}
        </p>
      )}
    </div>
  );
}

export default CommitteeMatchCenterPage;
