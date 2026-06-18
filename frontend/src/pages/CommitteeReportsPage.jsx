import { ChevronLeft, ChevronRight, Eye, LoaderCircle, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CommitteeLayout from "@/components/CommitteeLayout";
import CommitteeReportDrawer from "@/components/CommitteeReportDrawer";
import StatusBadge from "@/components/StatusBadge";
import FormAlert from "@/components/FormAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import useAuth from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import { formatDateTime, getEventName, reportStatuses } from "@/lib/committee";

const tabs = [
  ["missing", "Missing Reports"],
  ["found", "Found Reports"],
];

function CommitteeReportsPage() {
  const { token } = useAuth();
  const [type, setType] = useState("missing");
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [query, setQuery] = useState({ search: "", status: "", sortBy: "createdAt", order: "desc", page: 1 });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams(
      Object.entries(query).filter(([, value]) => value !== ""),
    );
    const data = await apiRequest(`/committee/${type}-reports?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReports(data.reports);
    setPagination(data.pagination);
    setLoading(false);
  }, [query, token, type]);

  useEffect(() => {
    loadReports().catch((requestError) => {
      setError(requestError.message);
      setLoading(false);
    });
  }, [loadReports]);

  const patchReport = async (report, body) => {
    const data = await apiRequest(`/committee/report/${report._id}/${body.decision ? "verify" : "status"}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type, ...body }),
    });
    setReports((current) => current.map((item) => (item._id === report._id ? data.report : item)));
    setSelected(data.report);
  };

  const changePage = (page) => {
    setQuery((current) => ({ ...current, page }));
  };

  const updateFilter = (key, value) => {
    setQuery((current) => ({ ...current, [key]: value, page: 1 }));
  };

  return (
    <CommitteeLayout
      title="Reports Management"
      description="Search, review, verify, reject, and update reports from assigned events."
    >
      {error && <div className="mb-5"><FormAlert>{error}</FormAlert></div>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex overflow-x-auto rounded-xl bg-slate-100 p-1">
            {tabs.map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setType(key);
                  setQuery((current) => ({ ...current, page: 1 }));
                }}
                className={`min-w-max rounded-lg px-4 py-2 text-sm font-bold transition ${type === key ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_170px_150px_110px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400" />
              <Input
                value={query.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                placeholder="Search reports"
                className="pl-10"
              />
            </div>
            <Select value={query.status} onChange={(event) => updateFilter("status", event.target.value)}>
              <option value="">All statuses</option>
              {reportStatuses.map((status) => (
                <option key={status} value={status}>{status.replace("_", " ")}</option>
              ))}
            </Select>
            <Select value={query.sortBy} onChange={(event) => updateFilter("sortBy", event.target.value)}>
              <option value="createdAt">Created</option>
              <option value={type === "missing" ? "age" : "approxAge"}>Age</option>
              {type === "missing" && <option value="lastSeenDate">Last seen</option>}
              <option value="reviewStatus">Status</option>
            </Select>
            <Select value={query.order} onChange={(event) => updateFilter("order", event.target.value)}>
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Photo</th>
                <th className="px-5 py-3">{type === "missing" ? "Name" : "Approx Age"}</th>
                <th className="px-5 py-3">Age</th>
                <th className="px-5 py-3">Gender</th>
                <th className="px-5 py-3">{type === "missing" ? "Last Seen" : "Found Location"}</th>
                <th className="px-5 py-3">Event</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="8" className="px-5 py-16 text-center"><LoaderCircle className="mx-auto size-6 animate-spin text-brand-600" /></td></tr>
              ) : reports.length ? reports.map((report) => (
                <tr key={report._id} className="align-middle">
                  <td className="px-5 py-4">
                    <img src={report.photo?.url} alt="" className="size-12 rounded-xl object-cover" />
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900">
                    {type === "missing" ? report.name : report.approxAge}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{type === "missing" ? report.age : report.approxAge}</td>
                  <td className="px-5 py-4 capitalize text-slate-600">{report.gender}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {type === "missing" ? (
                      <span>{report.lastSeenLocation}<br /><small className="text-slate-400">{formatDateTime(report.lastSeenDate)}</small></span>
                    ) : report.foundLocation}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{getEventName(report)}</td>
                  <td className="px-5 py-4"><StatusBadge status={report.reviewStatus} /></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelected(report)}><Eye className="size-3.5" />View</Button>
                      <Button size="sm" variant="ghost" onClick={() => patchReport(report, { decision: "verify" })}>Verify</Button>
                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => patchReport(report, { decision: "reject" })}>Reject</Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="8" className="px-5 py-16 text-center text-slate-500">No reports found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.pages} · {pagination.total} records
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => changePage(pagination.page - 1)}>
              <ChevronLeft className="size-4" />Previous
            </Button>
            <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages} onClick={() => changePage(pagination.page + 1)}>
              Next<ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <CommitteeReportDrawer
        report={selected}
        type={type}
        onClose={() => setSelected(null)}
        onVerify={(report) => patchReport(report, { decision: "verify" })}
        onReject={(report) => patchReport(report, { decision: "reject" })}
        onStatus={(report, status) => patchReport(report, { status })}
      />
    </CommitteeLayout>
  );
}

export default CommitteeReportsPage;
