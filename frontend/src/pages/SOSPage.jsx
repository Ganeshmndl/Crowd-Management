import { LoaderCircle, MapPin, Siren, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import FormAlert from "@/components/FormAlert";
import StatusBadge from "@/components/StatusBadge";
import UserModuleLayout from "@/components/UserModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";

const initialForm = { location: "", message: "", severity: "high" };

function SOSPage() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    const data = await apiRequest("/sos-requests", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests(data.requests);
  }, [token]);

  useEffect(() => {
    loadRequests()
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [loadRequests]);

  const fillCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Location services are not available in this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setForm((current) => ({
          ...current,
          location: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`,
        })),
      () => setError("Unable to access your location"),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await apiRequest("/sos-requests", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      setForm(initialForm);
      await loadRequests();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (request, status) => {
    try {
      const data = await apiRequest(`/sos-requests/${request._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setRequests((current) => current.map((item) => item._id === request._id ? data.request : item));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const removeRequest = async (request) => {
    if (!window.confirm("Delete this SOS request?")) return;
    await apiRequest(`/sos-requests/${request._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests((current) => current.filter((item) => item._id !== request._id));
  };

  return (
    <UserModuleLayout title="SOS assistance" description="Send your exact situation to the event response team.">
      {error && <div className="mb-5"><FormAlert>{error}</FormAlert></div>}
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
          <span className="grid size-11 place-items-center rounded-xl bg-red-50 text-red-600"><Siren className="size-5" /></span>
          <h2 className="mt-5 text-xl font-bold text-slate-950">Request help</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">For immediate life-threatening danger, also contact local emergency services.</p>
          <div className="mt-6 space-y-5">
            <div>
              <Label htmlFor="sos-location">Location</Label>
              <div className="flex gap-2">
                <Input id="sos-location" required placeholder="Gate, zone, landmark, or coordinates" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} />
                <Button type="button" variant="outline" size="icon" onClick={fillCurrentLocation} aria-label="Use current location"><MapPin className="size-4" /></Button>
              </div>
            </div>
            <div>
              <Label htmlFor="severity">Severity</Label>
              <Select id="severity" value={form.severity} onChange={(event) => setForm((current) => ({ ...current, severity: event.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="sos-message">Message</Label>
              <Textarea id="sos-message" required placeholder="Describe what happened and the assistance needed" value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} />
            </div>
            <Button type="submit" className="w-full bg-red-600 shadow-red-600/20 hover:bg-red-700" disabled={submitting}>
              {submitting && <LoaderCircle className="size-4 animate-spin" />}
              Send SOS request
            </Button>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-bold text-slate-950">Request history</h2>
          </div>
          {loading ? (
            <div className="grid min-h-64 place-items-center"><LoaderCircle className="size-7 animate-spin text-brand-600" /></div>
          ) : requests.length ? (
            <div className="divide-y divide-slate-100">
              {requests.map((request) => (
                <article key={request._id} className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><MapPin className="size-4 text-red-500" />{request.location}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{request.message}</p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Select className="h-9 w-auto text-xs" value={request.status} onChange={(event) => updateStatus(request, event.target.value)}>
                      {["active", "responding", "resolved", "cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}
                    </Select>
                    <span className="text-xs font-semibold capitalize text-slate-400">{request.severity} severity</span>
                    <Button size="sm" variant="ghost" className="ml-auto text-red-600" onClick={() => removeRequest(request)}><Trash2 className="size-3.5" />Delete</Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="px-6 py-16 text-center text-sm text-slate-500">No SOS requests for this event.</p>
          )}
        </div>
      </div>
    </UserModuleLayout>
  );
}

export default SOSPage;
