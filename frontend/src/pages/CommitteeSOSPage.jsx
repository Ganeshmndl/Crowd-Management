import { Eye, LoaderCircle, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CommitteeLayout from "@/components/CommitteeLayout";
import FormAlert from "@/components/FormAlert";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import useAuth from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import { formatDateTime, getEventName, getReporter } from "@/lib/committee";

function CommitteeSOSPage() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ search: "", severity: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value !== ""),
    );
    const data = await apiRequest(`/committee/sos?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests(data.requests);
    setLoading(false);
  }, [filters, token]);

  useEffect(() => {
    loadRequests().catch((requestError) => {
      setError(requestError.message);
      setLoading(false);
    });
  }, [loadRequests]);

  const updateAction = async (request, action) => {
    const data = await apiRequest(`/committee/sos/${request._id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    });
    setRequests((current) => current.map((item) => (item._id === request._id ? data.request : item)));
    setSelected(data.request);
  };

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <CommitteeLayout title="SOS Center" description="Triage and resolve SOS requests for assigned events.">
      {error && <div className="mb-5"><FormAlert>{error}</FormAlert></div>}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-[1fr_160px_160px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Search message or location"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
            />
          </div>
          <Select value={filters.severity} onChange={(event) => updateFilter("severity", event.target.value)}>
            <option value="">All severity</option>
            {["low", "medium", "high", "critical"].map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>
          <Select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
            <option value="">All status</option>
            {["active", "responding", "resolved", "cancelled"].map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Message</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Event</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="px-5 py-16 text-center"><LoaderCircle className="mx-auto size-6 animate-spin text-brand-600" /></td></tr>
              ) : requests.length ? requests.map((request) => (
                <tr key={request._id}>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold capitalize text-red-700 ring-1 ring-inset ring-red-200">
                      {request.severity}
                    </span>
                  </td>
                  <td className="max-w-xs truncate px-5 py-4 text-slate-700">{request.message}</td>
                  <td className="px-5 py-4 text-slate-600">{request.location}</td>
                  <td className="px-5 py-4 text-slate-600">{getReporter(request)}</td>
                  <td className="px-5 py-4 text-slate-600">{getEventName(request)}</td>
                  <td className="px-5 py-4"><StatusBadge status={request.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelected(request)}><Eye className="size-3.5" />View</Button>
                      <Button size="sm" variant="ghost" onClick={() => updateAction(request, "assign")}>Assign</Button>
                      <Button size="sm" variant="ghost" className="text-emerald-700" onClick={() => updateAction(request, "resolve")}>Resolve</Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="px-5 py-16 text-center text-slate-500">No SOS requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm">
          <div className="ml-auto flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
            <div className="border-b border-slate-100 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600">SOS request</p>
              <h2 className="mt-1 text-lg font-bold text-slate-950">{selected.location}</h2>
            </div>
            <div className="space-y-5 p-5 text-sm">
              <StatusBadge status={selected.status} />
              <p className="rounded-2xl bg-slate-50 p-4 leading-6 text-slate-700">{selected.message}</p>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div><dt className="font-bold text-slate-500">Severity</dt><dd className="mt-1 capitalize">{selected.severity}</dd></div>
                <div><dt className="font-bold text-slate-500">Created</dt><dd className="mt-1">{formatDateTime(selected.createdAt)}</dd></div>
                <div><dt className="font-bold text-slate-500">User</dt><dd className="mt-1">{getReporter(selected)}</dd><dd className="text-xs text-slate-500">{selected.userId?.email}</dd></div>
                <div><dt className="font-bold text-slate-500">Event</dt><dd className="mt-1">{getEventName(selected)}</dd></div>
                <div className="sm:col-span-2"><dt className="font-bold text-slate-500">Assigned to</dt><dd className="mt-1">{selected.assignedCommitteeId?.name || "Unassigned"}</dd></div>
              </dl>
              <div className="flex gap-3">
                <Button onClick={() => updateAction(selected, "assign")}>Assign to me</Button>
                <Button variant="outline" onClick={() => updateAction(selected, "resolve")}>Resolve</Button>
                <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CommitteeLayout>
  );
}

export default CommitteeSOSPage;
