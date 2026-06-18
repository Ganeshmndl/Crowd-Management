import { X } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  formatDateTime,
  getEventName,
  getReporter,
  reportStatuses,
} from "@/lib/committee";

function CommitteeReportDrawer({
  report,
  type,
  onClose,
  onVerify,
  onReject,
  onStatus,
}) {
  if (!report) return null;

  const isMissing = type === "missing";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm">
      <div className="ml-auto flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
              Report details
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-950">
              {isMissing
                ? report.name
                : `Found person near ${report.foundLocation}`}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close details"
          >
            <X className="size-5" />
          </Button>
        </header>

        <div className="space-y-6 p-5">
          {report.photo?.url && (
            <img
              src={report.photo.url}
              alt=""
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          )}

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={report.reviewStatus} />
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold capitalize text-slate-600">
              {report.status}
            </span>
          </div>

          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-bold text-slate-500">Reporter</dt>
              <dd className="mt-1 text-slate-950">{getReporter(report)}</dd>
              <dd className="text-xs text-slate-500">{report.userId?.email}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Event</dt>
              <dd className="mt-1 text-slate-950">{getEventName(report)}</dd>
              <dd className="text-xs text-slate-500">
                {report.eventId?.venue}, {report.eventId?.district}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">
                {isMissing ? "Age" : "Approx age"}
              </dt>
              <dd className="mt-1 text-slate-950">
                {isMissing ? report.age : report.approxAge}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Gender</dt>
              <dd className="mt-1 capitalize text-slate-950">
                {report.gender}
              </dd>
            </div>
            {isMissing && (
              <>
                <div>
                  <dt className="font-bold text-slate-500">Primary number</dt>
                  <dd className="mt-1 text-slate-950">{report.contactNumber}</dd>
                </div>
                {report.secondaryContactNumber && (
                  <div>
                    <dt className="font-bold text-slate-500">Secondary number</dt>
                    <dd className="mt-1 text-slate-950">{report.secondaryContactNumber}</dd>
                  </div>
                )}
              </>
            )}
            <div className="sm:col-span-2">
              <dt className="font-bold text-slate-500">
                {isMissing ? "Last seen" : "Found location"}
              </dt>
              <dd className="mt-1 text-slate-950">
                {isMissing ? report.lastSeenLocation : report.foundLocation}
              </dd>
              {isMissing && (
                <dd className="text-xs text-slate-500">
                  {formatDateTime(report.lastSeenDate)}
                </dd>
              )}
            </div>
            {!isMissing && (
              <div className="sm:col-span-2">
                <dt className="font-bold text-slate-500">Help desk</dt>
                <dd className="mt-1 text-slate-950">{report.helpDesk}</dd>
              </div>
            )}
            {!isMissing &&
              (report.foundPersonName || report.reporterMobile) && (
                <>
                  {report.foundPersonName && (
                    <div>
                      <dt className="font-bold text-slate-500">
                        Found Person Name
                      </dt>
                      <dd className="mt-1 text-slate-950">
                        {report.foundPersonName}
                      </dd>
                    </div>
                  )}
                  {report.reporterMobile && (
                    <div>
                      <dt className="font-bold text-slate-500">
                        Reporter Mobile
                      </dt>
                      <dd className="mt-1 text-slate-950">
                        {report.reporterMobile}
                      </dd>
                    </div>
                  )}
                </>
              )}
            <div className="sm:col-span-2">
              <dt className="font-bold text-slate-500">Description</dt>
              <dd className="mt-1 whitespace-pre-line leading-6 text-slate-700">
                {report.description || "No description provided."}
              </dd>
            </div>
          </dl>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-950">
              Committee actions
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button onClick={() => onVerify(report)}>Verify</Button>
              <Button
                variant="outline"
                className="text-red-600"
                onClick={() => onReject(report)}
              >
                Reject
              </Button>
              <Select
                className="sm:col-span-2"
                value={report.reviewStatus}
                onChange={(event) => onStatus(report, event.target.value)}
              >
                {reportStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommitteeReportDrawer;
