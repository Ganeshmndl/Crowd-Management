import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserModuleLayout from "@/components/UserModuleLayout";
import useAuth from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import { LoaderCircle } from "lucide-react";

function ReunificationPage() {
  const { token } = useAuth();
  const { ticketId } = useParams();
  const [reunification, setReunification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ticketId) {
      apiRequest(`/reunification/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((data) => setReunification(data.reunification))
        .finally(() => setLoading(false));
    }
  }, [ticketId, token]);

  if (loading) {
    return (
      <UserModuleLayout
        title="Reunification Ticket"
        description="Your reunification details"
      >
        <div className="grid place-items-center min-h-[50vh]">
          <LoaderCircle className="size-8 animate-spin text-brand-600" />
        </div>
      </UserModuleLayout>
    );
  }

  if (!reunification) {
    return (
      <UserModuleLayout
        title="Reunification Ticket"
        description="Your reunification details"
      >
        <p className="text-center py-10">Ticket not found</p>
      </UserModuleLayout>
    );
  }

  return (
    <UserModuleLayout
      title={`Reunification Ticket ${ticketId}`}
      description="Details for your scheduled reunification"
    >
      <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm">
        <div className="mb-6">
          <StatusBadge status={reunification.reunificationStatus} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {reunification.missingPersonName ? `Reuniting ${reunification.missingPersonName}` : "Reunification Details"}
        </h3>
        <dl className="grid gap-4 mt-4 text-sm sm:grid-cols-2">
          {reunification.helpDeskLocation && (
            <div>
              <dt className="font-bold text-slate-500">Help Desk Location</dt>
              <dd className="mt-1 text-slate-900">
                {reunification.helpDeskLocation}
              </dd>
            </div>
          )}
          {reunification.committeeContactName && (
            <div>
              <dt className="font-bold text-slate-500">Committee Contact</dt>
              <dd className="mt-1 text-slate-900">
                {reunification.committeeContactName}
              </dd>
            </div>
          )}
          {reunification.committeeContactNumber && (
            <div>
              <dt className="font-bold text-slate-500">Contact Number</dt>
              <dd className="mt-1 text-slate-900">
                {reunification.committeeContactNumber}
              </dd>
            </div>
          )}
          {reunification.meetingTime && (
            <div>
              <dt className="font-bold text-slate-500">Meeting Time</dt>
              <dd className="mt-1 text-slate-900">
                {new Intl.DateTimeFormat("en", {
                  dateStyle: "full",
                  timeStyle: "short",
                }).format(new Date(reunification.meetingTime))}
              </dd>
            </div>
          )}
        </dl>
        {reunification.matchNotes && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50">
            <h4 className="font-semibold text-slate-800">Notes</h4>
            <p className="mt-2 text-sm text-slate-700">
              {reunification.matchNotes}
            </p>
          </div>
        )}
        <div className="mt-8 p-5 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-900">Instructions</h4>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-emerald-500">✓</span> Bring a valid government ID
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-emerald-500">✓</span> Bring a family photo for verification
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-emerald-500">✓</span> Bring relationship proof (if available)
            </li>
          </ul>
        </div>
      </div>
    </UserModuleLayout>
  );
}

export default ReunificationPage;
